import create from 'zustand';

const query = new URLSearchParams(window.location.search);
const npointId = query.get('projectId') || '830360b5f6a82edd4912'; // points to the npoint document
const quasarId = query.get('quasarId') || 0;

const useStore = create((set) => ({
  isDesktopMode:
    !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ),
  npointId: npointId, // points to the npoint document
  isCaught: false,
  activeQuasar: null,
  projectData: null,
  selectedQuasar: quasarId, // converting from 1-indexed to 0-indexed for usability
  currentLevel: 0,
  itemDetails: null,
  setItemDetails: (itemDetails) => set({ itemDetails }),
  setProjectData: (project, selectedQuasar) =>
    set({
      projectData: project,
      activeQuasar: project.quasars[selectedQuasar],
    }),
  catchQuasar: () => set((state) => ({ isCaught: true })),
  releaseQuasar: () => set((state) => ({ isCaught: false })),
  // setLevaControls: (controls) => set((state) => ({ levaControls: controls })),
  setCurrentLevel: (currentLevel) =>
    set((state) => ({ currentLevel: Number(currentLevel) })),
  setActiveQuasar: (quasarIdx) =>
    set((state) => ({
      activeQuasar: state.projectData?.quasars?.[quasarIdx],
      itemDetails: null,
      isCaught: false,
      currentLevel: 0,
    })),
  setIsDesktopMode: (isDesktopMode) => set({ isDesktopMode }),
  setNpointId: (npointId) =>
    set({
      npointId,
      activeQuasar: null,
      itemDetails: null,
      isCaught: false,
      currentLevel: 0,
      selectedQuasar: 0,
    }),
}));

export default useStore;
