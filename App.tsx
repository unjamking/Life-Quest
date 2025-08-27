
import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Screen, ModalType } from './types';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import GuildScreen from './screens/GuildScreen';
import ShopScreen from './screens/ShopScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNavBar from './navigation/BottomNavBar';
import Toast from './components/Toast';
import Modal from './components/Modal';
import PreferencesModal from './components/modals/PreferencesModal';
import ProofUploadModal from './components/modals/ProofUploadModal';
import RewardedAdModal from './components/modals/RewardedAdModal';
import AiCoachModal from './components/modals/AiCoachModal';
import LegalModal from './components/modals/LegalModal';
import DeleteAccountModal from './components/modals/DeleteAccountModal';
import CreateGuildModal from './components/modals/CreateGuildModal';
import ChangePasswordModal from './components/modals/ChangePasswordModal';
import AvatarEditorModal from './components/modals/AvatarEditorModal';
import FloatingCoachButton from './components/FloatingCoachButton';
import PaymentMethodModal from './components/modals/PaymentMethodModal';
import CreditCardModal from './components/modals/CreditCardModal';
import PayPalModal from './components/modals/PayPalModal';

const screenComponents: { [key in Screen]: React.ComponentType } = {
  [Screen.LOGIN]: LoginScreen,
  [Screen.DASHBOARD]: DashboardScreen,
  [Screen.LEADERBOARD]: LeaderboardScreen,
  [Screen.GUILDS]: GuildScreen,
  [Screen.SHOP]: ShopScreen,
  [Screen.PROFILE]: ProfileScreen,
};

const ModalContent: React.FC = () => {
    const { activeModal, hideModal } = useAppContext();
    if (!activeModal) return null;

    const modalDetails: { [key in ModalType]?: { title: string, component: React.ReactNode } } = {
        [ModalType.PREFERENCES]: { title: "New Quests", component: <PreferencesModal /> },
        [ModalType.PROOF_UPLOAD]: { title: "Submit Proof", component: <ProofUploadModal {...activeModal.props} /> },
        [ModalType.REWARDED_AD]: { title: "Bonus XP", component: <RewardedAdModal /> },
        [ModalType.AI_COACH]: { title: "AI Coach", component: <AiCoachModal /> },
        [ModalType.LEGAL]: { title: "Legal Information", component: <LegalModal /> },
        [ModalType.DELETE_ACCOUNT]: { title: "Confirm Deletion", component: <DeleteAccountModal /> },
        [ModalType.CREATE_GUILD]: { title: "Create a New Guild", component: <CreateGuildModal /> },
        [ModalType.CHANGE_PASSWORD]: { title: "Change Password", component: <ChangePasswordModal /> },
        [ModalType.AVATAR_EDITOR]: { title: "Edit Avatar", component: <AvatarEditorModal {...activeModal.props} /> },
        [ModalType.PAYMENT_METHOD]: { title: "Choose Payment Method", component: <PaymentMethodModal /> },
        [ModalType.CREDIT_CARD]: { title: "Card Details", component: <CreditCardModal /> },
        [ModalType.PAYPAL]: { title: "PayPal Checkout", component: <PayPalModal /> },
    };
    
    const details = modalDetails[activeModal.type];
    
    if (!details) return null;

    return (
        <Modal isOpen={!!activeModal} onClose={hideModal} title={details.title}>
            {details.component}
        </Modal>
    );
}

const AppContent: React.FC = () => {
  const { activeScreen, isAuthenticated } = useAppContext();
  const ActiveScreen = screenComponents[activeScreen];

  return (
    <div className="h-full w-full max-w-md mx-auto bg-white shadow-lg relative overflow-hidden">
      <main key={activeScreen} className="w-full h-full animate-screen-fade-in">
        <ActiveScreen />
      </main>
      
      {isAuthenticated && (
        <>
          <BottomNavBar />
          <FloatingCoachButton />
        </>
      )}
      <Toast />
      <ModalContent />
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;