/**
 * Pam App — Login Screen
 */
import { useCallback } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Input } from '@components/ui';
import { useAuth } from '@hooks/useAuth';
import type { LoginCredentials } from '@types/index';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginScreen() {
  const { login, isLoading, error } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = useCallback(
    async (data: LoginCredentials) => {
      await login(data).catch(() => {
        // Error is surfaced via store.error
      });
    },
    [login]
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="mb-10">
            <Text className="text-4xl font-bold text-white">Welcome back 👋</Text>
            <Text className="mt-2 text-base text-gray-400">Sign in to continue to Pam</Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="••••••••"
                  secureTextEntry
                  autoComplete="current-password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />

            {/* API Error */}
            {error ? (
              <Text className="text-sm text-red-400">{error}</Text>
            ) : null}

            <Button
              label="Sign In"
              isLoading={isLoading}
              onPress={handleSubmit(onSubmit)}
              fullWidth
              size="lg"
            />
          </View>

          {/* Footer */}
          <View className="mt-8 flex-row justify-center gap-1">
            <Text className="text-gray-400">Don&apos;t have an account?</Text>
            <Link href="/(auth)/register" className="text-primary-400 font-medium">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
