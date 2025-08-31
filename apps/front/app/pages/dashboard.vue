<script setup lang="ts">
interface Expense {
  id: number
  date: string
  description: string
  category: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  currency: 'BRL' | 'USD'
}

interface Category {
  name: string
  color: string
  budget: number
  spent: number
}

interface UserProfile {
  name: string
  email: string
  avatar: string
}

// Reactive data
const currentCurrency = ref<'BRL' | 'USD'>('BRL')
const showAddExpenseModal = ref(false)
const sidebarOpen = ref(false)

// Mock user data
const user: UserProfile = {
  name: 'Lucas Silva',
  email: 'lucas@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
}

// Mock expense data
const expenses = ref<Expense[]>([
  { id: 1, date: '2025-08-30', description: 'Grocery Shopping', category: 'Food', amount: 150.50, status: 'paid', currency: 'BRL' },
  { id: 2, date: '2025-08-29', description: 'Internet Bill', category: 'Fixed Expenses', amount: 89.99, status: 'pending', currency: 'BRL' },
  { id: 3, date: '2025-08-28', description: 'Gas Station', category: 'Transportation', amount: 75.00, status: 'paid', currency: 'BRL' },
  { id: 4, date: '2025-08-27', description: 'Coffee Shop', category: 'Food', amount: 25.50, status: 'paid', currency: 'BRL' },
  { id: 5, date: '2025-08-26', description: 'Phone Bill', category: 'Fixed Expenses', amount: 45.99, status: 'overdue', currency: 'BRL' },
  { id: 6, date: '2025-08-25', description: 'Online Course', category: 'Education', amount: 199.99, status: 'paid', currency: 'BRL' },
  { id: 7, date: '2025-08-24', description: 'Gym Membership', category: 'Health', amount: 89.99, status: 'pending', currency: 'BRL' },
  { id: 8, date: '2025-08-23', description: 'Restaurant Dinner', category: 'Food', amount: 120.00, status: 'paid', currency: 'BRL' }
])

// Mock categories
const categories = ref<Category[]>([
  { name: 'Food', color: 'bg-green-500', budget: 800, spent: 296 },
  { name: 'Fixed Expenses', color: 'bg-blue-500', budget: 1200, spent: 135.98 },
  { name: 'Transportation', color: 'bg-yellow-500', budget: 300, spent: 75 },
  { name: 'Education', color: 'bg-purple-500', budget: 500, spent: 199.99 },
  { name: 'Health', color: 'bg-pink-500', budget: 200, spent: 89.99 },
  { name: 'Entertainment', color: 'bg-indigo-500', budget: 400, spent: 120 }
])

// Monthly income
const monthlyIncome = ref(5000)

// Exchange rate (mock)
const exchangeRate = 5.20 // BRL to USD

// Computed properties
const totalBalance = computed(() => {
  const totalExpenses = expenses.value.reduce((sum, expense) => sum + expense.amount, 0)
  return monthlyIncome.value - totalExpenses
})

const totalExpenses = computed(() => {
  return expenses.value.reduce((sum, expense) => sum + expense.amount, 0)
})

const remainingBudget = computed(() => {
  const totalBudget = categories.value.reduce((sum, cat) => sum + cat.budget, 0)
  return totalBudget - totalExpenses.value
})

const formatCurrency = (amount: number) => {
  const value = currentCurrency.value === 'USD' ? amount / exchangeRate : amount
  const symbol = currentCurrency.value === 'USD' ? '$' : 'R$'
  return `${symbol} ${value.toFixed(2)}`
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'overdue': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'paid': return '✓'
    case 'pending': return '⏱'
    case 'overdue': return '⚠'
    default: return '?'
  }
}

// Form data for new expense
const newExpense = ref({
  description: '',
  category: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  status: 'pending' as const
})

const addExpense = () => {
  const expense: Expense = {
    id: Date.now(),
    description: newExpense.value.description,
    category: newExpense.value.category,
    amount: newExpense.value.amount,
    date: newExpense.value.date,
    status: newExpense.value.status,
    currency: currentCurrency.value
  }
  
  expenses.value.unshift(expense)
  
  // Update category spent amount
  const category = categories.value.find(c => c.name === expense.category)
  if (category) {
    category.spent += expense.amount
  }
  
  // Reset form
  newExpense.value = {
    description: '',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'pending'
  }
  
  showAddExpenseModal.value = false
}

// Set page meta
definePageMeta({
  title: 'Dashboard - Financial Manager'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- App Title & Mobile Menu -->
          <div class="flex items-center">
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 class="ml-2 text-2xl font-bold text-gray-900">Financial Manager</h1>
          </div>

          <!-- Currency Toggle & User Profile -->
          <div class="flex items-center space-x-4">
            <!-- Currency Toggle -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">Currency:</span>
              <button
                @click="currentCurrency = currentCurrency === 'BRL' ? 'USD' : 'BRL'"
                class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                {{ currentCurrency }}
              </button>
            </div>

            <!-- User Profile Dropdown -->
            <div class="relative">
              <button class="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <img class="h-8 w-8 rounded-full" :src="user.avatar" :alt="user.name" />
                <span class="hidden md:block text-gray-700">{{ user.name }}</span>
                <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Balance -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Balance</p>
              <p class="text-2xl font-bold" :class="totalBalance >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(totalBalance) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Monthly Income -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Monthly Income</p>
              <p class="text-2xl font-bold text-green-600">{{ formatCurrency(monthlyIncome) }}</p>
            </div>
          </div>
        </div>

        <!-- Monthly Expenses -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 rounded-lg">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Monthly Expenses</p>
              <p class="text-2xl font-bold text-red-600">{{ formatCurrency(totalExpenses) }}</p>
            </div>
          </div>
        </div>

        <!-- Remaining Budget -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Remaining Budget</p>
              <p class="text-2xl font-bold" :class="remainingBudget >= 0 ? 'text-purple-600' : 'text-red-600'">
                {{ formatCurrency(remainingBudget) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Categories Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Categories</h3>
              <button
                @click="showAddExpenseModal = true"
                class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Add Expense
              </button>
            </div>
            
            <div class="space-y-4">
              <div
                v-for="category in categories"
                :key="category.name"
                class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center">
                    <div :class="[category.color, 'w-3 h-3 rounded-full mr-3']"></div>
                    <span class="font-medium text-gray-900">{{ category.name }}</span>
                  </div>
                </div>
                <div class="text-sm text-gray-600">
                  Spent: {{ formatCurrency(category.spent) }} / {{ formatCurrency(category.budget) }}
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    :class="[category.color, 'h-2 rounded-full']"
                    :style="{ width: Math.min((category.spent / category.budget) * 100, 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Expense Table -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Recent Expenses</h3>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="expense in expenses" :key="expense.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ new Date(expense.date).toLocaleDateString() }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ expense.description }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div class="flex items-center">
                        <div 
                          :class="[categories.find(c => c.name === expense.category)?.color || 'bg-gray-500', 'w-2 h-2 rounded-full mr-2']"
                        ></div>
                        {{ expense.category }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ formatCurrency(expense.amount) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[getStatusColor(expense.status), 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium']">
                        <span class="mr-1">{{ getStatusIcon(expense.status) }}</span>
                        {{ expense.status.charAt(0).toUpperCase() + expense.status.slice(1) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Expense Modal -->
    <div v-if="showAddExpenseModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Add New Expense</h3>
            <button
              @click="showAddExpenseModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="addExpense" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                v-model="newExpense.description"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                v-model="newExpense.category"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                <option v-for="category in categories" :key="category.name" :value="category.name">
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                v-model="newExpense.amount"
                type="number"
                step="0.01"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                v-model="newExpense.date"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-model="newExpense.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showAddExpenseModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 md:hidden"
      @click="sidebarOpen = false"
    ></div>
  </div>
</template>