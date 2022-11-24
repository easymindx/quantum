import create from 'zustand';

const useStore = create((set) => ({
  isDesktopMode:
    !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ),
  projectId: '1',
  isCaught: false,
  isGalleryMode: false,
  activeQuasar: null,
  projectData: null,
  selectedQuasar: 2, // simulates selection from offcanvas
  currentLevel: 0,
  itemDetails: null,
  setItemDetails: (itemDetails) => set({ itemDetails }),
  setProjectData: (project) => set({ projectData: project }),
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
    })),
  // setLevaControls: (controls) => set((state) => ({ levaControls: controls })),
  setCurrentLevel: (currentLevel) =>
    set((state) => ({ currentLevel: Number(currentLevel) })),
  setSelectedQuasar: (selectedQuasar) =>
    set((state) => ({ selectedQuasar: Number(selectedQuasar) })),
  setIsDesktopMode: (isDesktopMode) => set({ isDesktopMode }),
}));

export default useStore;
