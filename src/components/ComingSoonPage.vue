<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center px-4">
      <div class="text-center max-w-2xl">
        <!-- Logo/Brand -->
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          unChonk
        </h1>

        <!-- Coming Soon Text -->
        <h2 class="text-2xl md:text-3xl font-semibold text-[#749076] mb-6">
          Coming Soon
        </h2>

        <!-- Description -->
        <p class="text-lg text-gray-600 mb-12 leading-relaxed">
          We're building something great. Transform any text into natural-sounding speech with premium AI voices.
        </p>

        <!-- Email Signup (optional - remove if not needed) -->
        <div class="max-w-md mx-auto">
          <p class="text-sm text-gray-500 mb-4">
            Get notified when we launch
          </p>
          <form @submit.prevent="handleSubmit" class="flex flex-col sm:flex-row gap-3">
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#749076] focus:border-transparent"
              required
            />
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-3 bg-[#749076] text-[#070807] font-semibold rounded-xl hover:bg-[#5f7760] transition duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Saving...' : 'Notify Me' }}
            </button>
          </form>
          <p v-if="submitted" class="mt-4 text-[#749076] font-medium">
            Thanks! We'll let you know when we launch.
          </p>
          <p v-if="error" class="mt-4 text-red-500 font-medium">
            {{ error }}
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="py-8">
      <div class="text-center">
        <p class="text-gray-500 text-sm">
          &copy; {{ currentYear }} unChonk by Chonky Heads
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { supabase } from '@shared/utils/supabase'

const email = ref('')
const submitted = ref(false)
const loading = ref(false)
const error = ref('')
const currentYear = computed(() => new Date().getFullYear())

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  const { error: insertError } = await supabase
    .from('email_signups')
    .insert({ email: email.value })

  loading.value = false

  if (insertError) {
    if (insertError.code === '23505') {
      // Duplicate email
      error.value = "You're already on the list!"
    } else {
      error.value = 'Something went wrong. Please try again.'
    }
    return
  }

  submitted.value = true
  email.value = ''
}
</script>
