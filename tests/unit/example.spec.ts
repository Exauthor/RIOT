import { shallowMount } from '@vue/test-utils'
import MPD from '@/components/block/widget/mpd'

describe('MpdWidget.vue', () => {
  it('renders text widget', () => {
    const msg = 'MPD'
    const wrapper = shallowMount(MPD)
    expect(wrapper.text()).toMatch(msg)
  })
})
