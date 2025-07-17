<template>
  <q-form @submit="handleLogin">
    <q-input
      class="full-width q-pa-md"
      v-model="form.email"
      label="Email"
      type="email"
      outlined
      dense
      :rules="[(val) => !!val || 'Email é obrigatório']"
    >
      <template v-slot:prepend>
        <q-icon name="mail" />
      </template>
    </q-input>

    <q-input
      v-model="form.password"
      class="full-width q-pa-md"
      label="Senha"
      :type="showPassword ? 'text' : 'password'"
      outlined
      dense
      :rules="[(val) => !!val || 'Senha é obrigatória']"
    >
      <template v-slot:prepend>
        <q-icon name="lock_outline" />
      </template>
      <template v-slot:append>
        <q-icon
          :name="showPassword ? 'visibility' : 'visibility_off'"
          class="cursor-pointer"
          @click="showPassword = !showPassword"
        />
      </template>
    </q-input>

    <div class="flex q-my-lg q-mx-sm">
      <q-checkbox v-model="rememberMe" label="Lembrar de mim" />
      <q-btn class="q-ml-auto" flat color="primary" label="Esqueci a senha" no-caps />
    </div >

    <div class="flex">
      <q-btn
        class="q-mx-auto"
        type="submit"
        color="primary"
        size="md"
        :loading="authStore.loading"
        :label="authStore.loading ? 'Entrando...' : 'Entrar'"
      />
    </div>

  </q-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useQuasar } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const rememberMe = ref(false)

const handleLogin = async () => {
  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password,
    })

    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Login realizado com sucesso!',
      })
      router.push('/')
    } else {
      $q.notify({
        type: 'negative',
        message: result.error || 'Erro ao fazer login',
      })
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro inesperado ao fazer login',
    })
  }
}
</script>