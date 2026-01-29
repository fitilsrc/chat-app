import * as React from 'react';
import { Alert, Pressable, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Separator } from '@/components/ui/separator';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See Clerk docs: custom flows error handling
      // for more info on error handling
      if (err instanceof Error) {
        Alert.alert('Error', err.message)
      } else {
        Alert.alert('Error', 'An unknown error occurred')
      }
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/(drawer)/(home)/(tabs)/chats')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See Clerk docs: custom flows error handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View className="gap-6 h-full justify-center items-center">
        <Card className="border-border/0 sm:border-border pb-4 shadow-none sm:shadow-sm sm:shadow-black/5">
          <CardHeader>
            <CardTitle className="text-center text-xl sm:text-left">Verify your email</CardTitle>
            <CardDescription className="text-center sm:text-left">
              Enter the verification code sent to m@example.com
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-6">
            <View className="gap-6">
              <View className="gap-1.5">
                <Label htmlFor="code">Verification code</Label>
                <Input
                  id="code"
                  autoCapitalize="none"
                  returnKeyType="send"
                  keyboardType="numeric"
                  autoComplete="sms-otp"
                  textContentType="oneTimeCode"
                  value={code}
                  onChangeText={(code) => setCode(code)}
                />
              </View>
              <View className="gap-3">
                <Button className="w-full" onPress={onVerifyPress}>
                  <Text>Continue</Text>
                </Button>
                <Button
                  variant="link"
                  className="mx-auto"
                  onPress={() => {
                    // TODO: Navigate to sign up screen
                  }}>
                  <Text>Cancel</Text>
                </Button>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    )
  }

  return (
    <View className="gap-6 h-full justify-center items-center">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Create your account</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                value={emailAddress}
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
              />
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
              </View>
              <Input
                id="password"
                secureTextEntry
                returnKeyType="send"
                value={password}
                onChangeText={(password) => setPassword(password)}
              />
            </View>
            <Button className="w-full" onPress={onSignUpPress}>
              <Text>Continue</Text>
            </Button>
          </View>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
          </View>
          <Text className="text-center text-sm">
            Already have an account?{' '}
            <Pressable
              onPress={() => router.push('/sign-in')}>
              <Text className="text-sm underline underline-offset-4">Sign in</Text>
            </Pressable>
          </Text>
        </CardContent>
      </Card>
    </View>
  )
}
