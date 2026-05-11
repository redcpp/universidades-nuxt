import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import App from '~/app.vue'

describe('App Smoke Test', () => {
  it('renders the navbar and main layout', async () => {
    const component = await mountSuspended(App)
    expect(component.html()).toContain('Universidades')
  })
})
