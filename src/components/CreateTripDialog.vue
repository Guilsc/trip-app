<template>
  <q-dialog v-model="modelValue">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Criar Nova Viagem</div>
      </q-card-section>
      <q-card-section>
        <q-input dense class="q-mb-md" outlined v-model="trip.destination" label="Destino" />
        <q-input dense class="q-mb-md" outlined v-model="trip.departure_date" label="Data de Partida" type="date" stack-label />
        <q-input dense outlined v-model="trip.return_date" label="Data de Retorno" type="date" stack-label />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" @click="$emit('cancel')" />
        <q-btn label="Criar" color="secondary" @click="$emit('create', trip)" :disable="isInvalid" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean,
  trip: any,
  isInvalid: boolean
}>()
</script>

