// tests/Login.spec.js
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import Login from '../src/components/Login.vue'
import { signInWithEmailAndPassword } from 'firebase/auth'

// Mock the store
const mockStore = createStore({
  state() {
    return {
      user: null,
      loading: false,
      error: null
    }
  },
  actions: {
    login: jest.fn()
  }
})

describe('Login.vue', () => {
  it('renders the login form', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [mockStore]
      }
    })

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('calls the login action when the form is submitted', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [mockStore]
      }
    })

    // Set form values
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')

    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')

    // Check if the login action was called
    expect(mockStore.dispatch).toHaveBeenCalledWith('login', {
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('shows loading state when logging in', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [mockStore]
      }
    })

    // Set loading to true
    wrapper.vm.loading = true

    // Check if the loading state is shown
    expect(wrapper.find('.spinner-border').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toContain('Iniciando sesión...')
  })
})