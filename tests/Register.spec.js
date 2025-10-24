// tests/Register.spec.js
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import Register from '../src/components/Register.vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const mockStore = createStore({
  state() {
    return {
      user: null,
      loading: false,
      error: null
    }
  },
  actions: {
    register: jest.fn()
  }
})

describe('Register.vue', () => {
  it('renders the registration form', () => {
    const wrapper = mount(Register, {
      global: {
        plugins: [mockStore]
      }
    })

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('input[id="confirmPassword"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('validates password match', async () => {
    const wrapper = mount(Register, {
      global: {
        plugins: [mockStore]
      }
    })

    // Set form values with mismatched passwords
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('input[id="confirmPassword"]').setValue('differentpassword')

    // Check if the submit button is disabled
    expect(wrapper.find('button[type="submit"]').element.disabled).toBe(true)
  })

  it('calls the register action when the form is submitted', async () => {
    const wrapper = mount(Register, {
      global: {
        plugins: [mockStore]
      }
    })

    // Set form values
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('input[id="confirmPassword"]').setValue('password123')

    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')

    // Check if the register action was called
    expect(mockStore.dispatch).toHaveBeenCalledWith('register', {
      email: 'test@example.com',
      password: 'password123'
    })
  })
})