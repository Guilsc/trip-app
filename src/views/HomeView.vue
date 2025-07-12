<template>
  <div class="page">
    <div class="card">
      <WelcomeCard :userName="authStore.user?.name || ''" @create-trip="openCreateTripDialog" />
      <TripFilters :filter="filter" :statusOptions="statusOptions" @clear-filters="clearFilters" @apply-filters="applyFilters" />
      <div class="q-mt-xl">
        <TripTable :rows="filteredTrips" :columns="columns" :isAdmin="authStore.user?.role === 'admin'" @edit-trip="openEditTripDialog" />
      </div>
    </div>
    <CreateTripDialog
      :modelValue="showCreateTripDialog"
      :trip="newTrip"
      :isInvalid="isCreateTripFormInvalid"
      @cancel="showCreateTripDialog = false"
      @create="createTripFromDialog"
    />
    <EditTripDialog
      :modelValue="showEditTripDialog"
      :selectedStatus="selectedStatus"
      :statusOptions="editStatusOptions"
      @cancel="showEditTripDialog = false"
      @save="updateTripStatusFromDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { tripService } from '@/services/api'
import { useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import WelcomeCard from '@/components/WelcomeCard.vue'
import TripFilters from '@/components/TripFilters.vue'
import TripTable from '@/components/TripTable.vue'
import CreateTripDialog from '@/components/CreateTripDialog.vue'
import EditTripDialog from '@/components/EditTripDialog.vue'

const authStore = useAuthStore()
const originalTrips = ref<any[]>([])

const appliedFilter = ref({
  dateRange: null,
  destination: '',
  status: [],
})

const filter = ref({
  dateRange: null,
  destination: '',
  status: [],
})

const filteredTrips = computed(() => {
  let currentTrips = originalTrips.value

  // Filtra por destino
  if (appliedFilter.value.destination) {
    currentTrips = currentTrips.filter((trip: any) =>
      trip.destination.toLowerCase().includes(appliedFilter.value.destination.toLowerCase())
    )
  }

  // Filtra por status
  if (appliedFilter.value.status && appliedFilter.value.status.length > 0) {
    const selectedStatuses = appliedFilter.value.status.map((s: any) => s.value)
    currentTrips = currentTrips.filter((trip: any) =>
      selectedStatuses.includes(trip.status.name.toLowerCase())
    )
  }

  return currentTrips
})

const showCreateTripDialog = ref(false)
const showEditTripDialog = ref(false)
const selectedTrip = ref<any>(null)
const selectedStatus = ref<any>(null)
const $q = useQuasar()

const statusOptions = [
  { label: 'Aprovado', value: 'aprovado' },
  { label: 'Solicitado', value: 'solicitado' },
  { label: 'Cancelado', value: 'cancelado' }
]

const editStatusOptions = computed(() => {
  if (!selectedTrip.value) return []
  return statusOptions.filter(option => option.value !== selectedTrip.value.status.name)
})

const newTrip = ref({
  destination: '',
  departure_date: '',
  return_date: '',
})

const isCreateTripFormInvalid = computed(() => {
  return !newTrip.value.destination || !newTrip.value.departure_date || !newTrip.value.return_date
})

// Se precisar de tipagem para columns, pode usar:
// type TableColumn = { name: string; label: string; field: string; align?: string; sortable?: boolean; };
// const columns: TableColumn[] = [...];

const columns: QTableProps['columns'] = [
  { name: 'destination', align: 'left', label: 'Destino', field: 'destination', sortable: true },
  { name: 'departure_date', align: 'left', label: 'Data de Partida', field: 'departure_date', sortable: true, format: (val: string) => new Date(val).toLocaleDateString() },
  { name: 'return_date', align: 'left', label: 'Data de Retorno', field: 'return_date', sortable: true, format: (val: string) => new Date(val).toLocaleDateString() },
  { name: 'status', align: 'center', label: 'Status', field: (row: any) => row.status.name.toLocaleLowerCase(), sortable: true },
  { name: 'actions', align: 'right', label: 'Ações', field: 'actions' }
]

const fetchTrips = async () => {
  try {
    const response = await tripService.listTripRequests()
    originalTrips.value = response.data
  } catch (error) {
    console.error('Erro ao buscar viagens:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar as viagens.',
    })
  }
}

const applyFilters = () => {
  appliedFilter.value = { ...filter.value }
}

const clearFilters = () => {
  filter.value = {
    dateRange: null,
    destination: '',
    status: [],
  }
  appliedFilter.value = { ...filter.value }
}

onMounted(fetchTrips)

const openCreateTripDialog = () => {
  newTrip.value = {
    destination: '',
    departure_date: '',
    return_date: '',
  }
  showCreateTripDialog.value = true
}

const openEditTripDialog = (trip: any) => {
  selectedTrip.value = trip
  selectedStatus.value = null
  showEditTripDialog.value = true
}

const updateTripStatus = async () => {
  if (!selectedTrip.value || !selectedStatus.value) return

  try {
    await tripService.updateTripRequestStatus(selectedTrip.value.id, { status: selectedStatus.value.value })
    showEditTripDialog.value = false
    $q.notify({
      type: 'positive',
      message: 'Status da viagem atualizado com sucesso!',
    })
    fetchTrips() // Atualiza a lista de viagens
  } catch (err: any) {
    console.log(err.response.data['error']);
    let errorMessage = 'Ocorreu um erro ao atualizar o status da viagem.';
    if (err.response && err.response.data && err.response.data['error']) {
      errorMessage = err.response.data['error'];
    } else if (err.response && err.response.data && err.response.data.errors.status) {
        errorMessage = err.response.data.errors.status[0];
    }
    $q.notify({
      type: 'negative',
      message: errorMessage,
    })
    console.error('Erro ao atualizar status da viagem:', err)
  }
}

const createTrip = async () => {
  try {
    await tripService.createTripRequest(newTrip.value)
    showCreateTripDialog.value = false
    $q.notify({
      type: 'positive',
      message: 'Viagem criada com sucesso!',
    })
    fetchTrips() // Atualiza a lista de viagens
  } catch (err: any) {
    let errorMessage = 'Ocorreu um erro ao criar a viagem.';
    if (err.response && err.response.data && err.response.data.errors) {
      const errorKey = Object.keys(err.response.data.errors)[0];
      errorMessage = err.response.data.errors[errorKey][0];
    } else if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message
    }
    $q.notify({
      type: 'negative',
      message: errorMessage,
    })
    console.error('Erro ao criar viagem:', err)
  }
}

// Substituir métodos de dialog para integração com os componentes
const createTripFromDialog = (trip: any) => {
  newTrip.value = trip
  createTrip()
}
const updateTripStatusFromDialog = (status: any) => {
  selectedStatus.value = status
  updateTripStatus()
}

</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
}

.card {
  border-radius: 16px;
  background: white;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
