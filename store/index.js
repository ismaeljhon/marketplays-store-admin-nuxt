export const state = () => ({
  pageTitle: null,
})

export const mutations = {
  setPageTitle(state, pageTitle) {
    state.pageTitle = pageTitle
  },
}
