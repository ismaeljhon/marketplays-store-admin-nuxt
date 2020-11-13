export const state = () => ({
  asideDrawer: true,
})

export const mutations = {
  showAsideDrawer(state, asideDrawer) {
    state.asideDrawer = asideDrawer
  },
}
