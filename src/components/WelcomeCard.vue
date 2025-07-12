<template>
  <div class="welcome-card">
    <div class="card-section text-center q-pa-md">
      <div class="text-h3 text-tertiary q-mb-md">
        <q-icon name="flight" size="4rem" color="secondary" />
        Bem-vindo ao Trip App!
      </div>
      <div class="text-h6 text-grey-7 q-mb-lg">Olá, {{ userName }}! 👋</div>
      <div class="text-body1 text-grey-6 q-mb-xl">
        Sua aplicação de gerenciamento de viagens está pronta para uso.
      </div>
      <q-btn color="secondary" label="Criar Viagem" @click="$emit('create-trip')" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ userName: string }>()
</script>

<style scoped>
.welcome-card {
  /* Pode adicionar estilos específicos se necessário */
}
</style>

