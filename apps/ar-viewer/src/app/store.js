import create from 'zustand';

const useStore = create((set) => ({
  projectId: '1',
  isCaught: false,
  isGalleryMode: false,
  activeQuasar: null, // TODO: set null and load from selection or on 'begin' click
  projectData: null,
  selectedQuasar: 0,
  setProjectData: (project) => set({ projectData: project }),
  setProjectId: (id) => set({ projectId: id }),
  // levaControls: {
  //   revealHidden: true,
  //   tier: 1,
  // },
  currentLevel: 0,
  catchQuasar: () => set((state) => ({ isCaught: true })),
  releaseQuasar: () => set((state) => ({ isCaught: false })),
  enterGalleryMode: () =>
    set((state) => ({ isGalleryMode: true, isCaught: true })),
  exitGalleryMode: () =>
    set((state) => ({ isGalleryMode: false, isCaught: true })),
  setActiveQuasar: (quasar) =>
    set((state) => ({
      activeQuasar: quasar,
      // previousQuasar: state.activeQuasar,
      isGalleryMode: false,
      isCaught: false,
      currentLevel: 0,
    })),
  // setLevaControls: (controls) => set((state) => ({ levaControls: controls })),
  setCurrentLevel: (currentLevel) =>
    set((state) => ({ currentLevel: Number(currentLevel) })),
  setSelectedQuasar: (selectedQuasar) =>
    set((state) => ({ selectedQuasar: Number(selectedQuasar) })),
}));

export default useStore;
