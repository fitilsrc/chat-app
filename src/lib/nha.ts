import * as Crypto from 'expo-crypto';

const masterKey = process.env.EXPO_PUBLIC_NHA_KEY!;

export const useCrypto = () => {

  async function generateRToken (input: string, iteration: number | null) {
    const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, input + (iteration ?? ''));
    return hash;
  }

  async function generateSbox(hash: string, p = 256) {
    
    let seed = BigInt("0x" + hash);
    function rng() {
        seed = (seed * 1103515245n + 12345n) % (2n ** 31n);
        return Number(seed) / Number(2n ** 31n);
    }

    const sbox = Array.from({ length: p }, (_, i) => i);

    for (let i = p - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [sbox[i], sbox[j]] = [sbox[j], sbox[i]];
    }

    const inv = new Array(p);
    for (let i = 0; i < p; i++) {
        inv[sbox[i]] = i;
    }

    return { sbox, inv };
  }

  function generateMatrix(hash: string, p = 256) {
    // SHA256 → seed
    let seed = BigInt("0x" + hash);

    // Детерминированный RNG (как в предыдущем коде)
    function rng() {
        seed = (seed * 1103515245n + 12345n) % (2n ** 31n);
        return Number(seed);
    }

    function randRange(min: number, max: number) {
        return min + (rng() % (max - min));
    }

    // Расширенный алгоритм Евклида для обратного элемента
    function modInverse(a: number, mod: number) {
        let t = 0, newT = 1;
        let r = mod, newR = a % mod;

        while (newR !== 0) {
            let q = Math.floor(r / newR);
            [t, newT] = [newT, t - q * newT];
            [r, newR] = [newR, r - q * newR];
        }

        if (r > 1) return null;
        if (t < 0) t += mod;
        return t;
    }

    function gcd(a: number, b: number) {
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return a;
    }

    while (true) {
        const a = randRange(1, p);
        const b = randRange(1, p);
        const c = randRange(1, p);
        const d = randRange(1, p);

        const det = ((a * d - b * c) % p + p) % p;

        if (gcd(det, p) === 1) {
            const invDet = modInverse(det, p);
            
            if (!invDet) {
              continue;
            }

            const matrix = [a, b, c, d];

            const inverse = [
                ( d * invDet) % p,
                ((-b * invDet) % p + p) % p,
                ((-c * invDet) % p + p) % p,
                ( a * invDet) % p
            ];

            return { matrix, inverse };
        }
    }
  }

  function generateVigenereKey(hash: string, length: number) {
    const key: string[] = [];
    for (let i = 0; i < length; i++) {
        key.push(hash[i % hash.length]);
    }

    return key;
  }

  const textEncoder = new TextEncoder();

  async function encrypt(text: string, p = 256): Promise<Uint8Array> {
    let data = textEncoder.encode(text);

    if (data.length % 2 !== 0) {
      const padded = new Uint8Array(data.length + 1);
      padded.set(data);
      padded[data.length] = 0;
      data = padded;
    }

    // ===== 6 раундов =====
    for (let r = 0; r < 6; r++) {
        const key = await generateRToken(masterKey, r);

        const { sbox } = await generateSbox(key, p);
        const { matrix: K_ab } = generateMatrix(key, p);
        const K_v = generateVigenereKey(key, data.length);

        let tmp = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            tmp[i] = sbox[data[i]];
        }
        data = tmp;

        tmp = new Uint8Array(data.length);

        for (let i = 0; i < data.length; i += 2) {
            const x1 = data[i];
            const x2 = data[i + 1];

            tmp[i]     = (K_ab[0] * x1 + K_ab[1] * x2) % p;
            tmp[i + 1] = (K_ab[2] * x1 + K_ab[3] * x2) % p;
        }

        data = tmp;

        tmp = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            tmp[i] = (data[i] + K_v[i].charCodeAt(0)) % p;
        }
        data = tmp;
    }

    const seed = await generateRToken(masterKey, null);

    const ks = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
        ks[i] = seed.charCodeAt(i % seed.length);
    }

    const dataXOR = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
        dataXOR[i] = data[i] ^ ks[i];
    }

    return dataXOR;  
}

  function decrypt(data: string) {
    // TODO: Implement decryption
    // =============================
    // INLINE KEY STREAM
    // =============================
    const seed = crypto
        .createHash("sha256")
        .update(String(masterKey))
        .digest();

    const ks = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
        ks[i] = seed[i % seed.length];
    }

    // XOR поток
    let tmp = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
        tmp[i] = data[i] ^ ks[i];
    }

    data = tmp;

    // ===== обратные раунды =====
    for (let r = 5; r >= 0; r--) {

        const key = roundKey(masterKey, r);

        const { inv } = generateSbox(key, p);
        const { inverse: K_abinv } = generateMatrix(key, p);
        const K_v = generateVigenereKey(key, data.length);

        // --- VIGENERE (обратный) ---
        tmp = Buffer.alloc(data.length);
        for (let i = 0; i < data.length; i++) {
            tmp[i] = ((data[i] - K_v[i]) % p + p) % p;
        }
        data = tmp;

        // --- AFFINE (обратный) ---
        tmp = Buffer.alloc(data.length);

        for (let i = 0; i < data.length; i += 2) {

            const y1 = data[i];
            const y2 = data[i + 1];

            tmp[i]     = (K_abinv[0] * y1 + K_abinv[1] * y2) % p;
            tmp[i + 1] = (K_abinv[2] * y1 + K_abinv[3] * y2) % p;
        }

        data = tmp;

        // --- SBOX (обратный) ---
        tmp = Buffer.alloc(data.length);

        for (let i = 0; i < data.length; i++) {
            tmp[i] = inv[data[i]];
        }

        data = tmp;
    }

    // убрать padding
    while (data[data.length - 1] === 0) {
        data = data.slice(0, -1);
    }

    return data.toString("utf8");
  }

  return {
    encrypt,
    decrypt,
  }
}
