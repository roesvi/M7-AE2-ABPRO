// tests/Admin.spec.js
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import Admin from '../src/components/Admin.vue'

const mockStore = createStore({
  state() {
    return {
      courses: [
        {
          id: '1',
          codigo: '0001',
          nombre: 'HTML',
          estado: true,
          precio: '30000',
          duracion: '1 mes',
          descripcion: 'curso html',
          cupos: 10,
          inscritos: 0,
          img: 'https://www.w3.org/html/logo/downloads/HTML5_Logo_512.png'
        }
      ],
      loading: false,
      error: null
    }
  },
  actions: {
    subscribeToCourses: jest.fn(),
    addCourse: jest.fn(),
    updateCourse: jest.fn(),
    deleteCourse: jest.fn()
  }
})

describe('Admin.vue', () => {
  it('renders the admin interface', () => {
    const wrapper = mount(Admin, {
      global: {
        plugins: [mockStore]
      }
    })

    expect(wrapper.find('h2').text()).toContain('Administración de Cursos')
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('button').text()).toContain('Agregar Curso')
  })

  it('displays the list of courses', () => {
    const wrapper = mount(Admin, {
      global: {
        plugins: [mockStore]
      }
    })

    expect(wrapper.find('tbody tr').exists()).toBe(true)
    expect(wrapper.find('tbody tr td').text()).toContain('HTML')
  })

  it('opens the add course modal when the add button is clicked', async () => {
    const wrapper = mount(Admin, {
      global: {
        plugins: [mockStore]
      }
    })

    // Click the add button
    await wrapper.find('button').trigger('click')

    // Check if the modal is shown
    expect(wrapper.find('.modal').exists()).toBe(true)
  })
})