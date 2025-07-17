<template>
  <q-dialog v-model="model">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Editar Status da Viagem</div>
      </q-card-section>
      <q-card-section>
        <q-select
          dense
          outlined
          v-model="internalStatus"
          :options="statusOptions"
          label="Status"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" @click="$emit('cancel')" />
        <q-btn label="Salvar" color="secondary" @click="$emit('save', internalStatus)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps<{
  modelValue: boolean,
  selectedStatus: string,
  statusOptions: string[]
}>()

const emit = defineEmits(['update:modelValue', 'cancel', 'save']);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const internalStatus = ref(props.selectedStatus)

watch(() => props.selectedStatus, (newValue) => {
  internalStatus.value = newValue
})
</script>

