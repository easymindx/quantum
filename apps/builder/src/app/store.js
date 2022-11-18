import create from 'zustand';

const useStore = create((set) => ({
  projectId: '1',
  projectData: null,
  setProjectData: (project) => set({ projectData: project }),
  setProjectId: (id) => set({ projectId: id }),
  // setActiveQuasar: (quasar) =>
  //   set((state) => ({
  //     activeQuasar: quasar,
  //     // previousQuasar: state.activeQuasar,
  //     isGalleryMode: false,
  //     isCaught: false,
  //     currentLevel: 0,
  //   })),
}));

export default useStore;
