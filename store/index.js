export const state = () => ({
  pageTitle: null,
  backToPage: {
    link: '/',
    title: 'Dashboard',
  },
})

export const mutations = {
  setPageTitle(state, pageTitle) {
    state.pageTitle = pageTitle
  },
  setBackToPage(state, { link, title }) {
    state.backToPage = {
      link,
      title,
    }
  },
}
