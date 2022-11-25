import create from 'zustand';

const useStore = create((set) => ({
  isDesktopMode:
    !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ),
  npointId: '830360b5f6a82edd4912', // points to the npoint document
  projectId: '1',
  isCaught: false,
  isGalleryMode: false,
  activeQuasar: null,
  projectData: null,
  selectedQuasar: 0, // simulates selection from offcanvas
  currentLevel: 0,
  itemDetails: null,
  setItemDetails: (itemDetails) => set({ itemDetails }),
  setProjectData: (project, selectedQuasar) =>
    set({
      projectData: project,
      activeQuasar: project.quasars[selectedQuasar],
    }),
  setProjectId: (id) => set({ projectId: id }),
  catchQuasar: () => set((state) => ({ isCaught: true })),
  releaseQuasar: () => set((state) => ({ isCaught: false })),
  enterGalleryMode: () => set((state) => ({ isGalleryMode: true })),
  exitGalleryMode: () => set((state) => ({ isGalleryMode: false })),
  setActiveQuasar: (quasar) =>
    set((state) => ({
      activeQuasar: quasar,
      isGalleryMode: false,
      isCaught: false,
      currentLevel: 0,
      itemDetails: null,
    })),
  // setLevaControls: (controls) => set((state) => ({ levaControls: controls })),
  setCurrentLevel: (currentLevel) =>
    set((state) => ({ currentLevel: Number(currentLevel) })),
  setSelectedQuasar: (selectedQuasar) =>
    set((state) => ({
      selectedQuasar: Number(selectedQuasar),
      activeQuasar: null,
    })),
  setIsDesktopMode: (isDesktopMode) => set({ isDesktopMode }),
  setNpointId: (npointId) => set({ npointId }),
}));

export default useStore;
