<template>
  <q-dialog v-model="model">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Criar Nova Viagem</div>
      </q-card-section>
      <q-card-section>
        <q-input dense class="q-mb-md" outlined v-model="localTrip.destination" label="Destino" />
        <q-input dense class="q-mb-md" outlined v-model="localTrip.departure_date" label="Data de Partida" type="date" stack-label />
        <q-input dense outlined v-model="localTrip.return_date" label="Data de Retorno" type="date" stack-label />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" @click="$emit('cancel')" />
        <q-btn label="Criar" color="secondary" @click="$emit('create', localTrip)" :disable="isInvalid" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean,
  trip: any,
  isInvalid: boolean
}>()

const emit = defineEmits(['update:modelValue', 'cancel', 'create']);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const localTrip = ref({ ...props.trip })

watch(() => props.trip, (newTrip) => {
  localTrip.value = { ...newTrip }
})

</script>

