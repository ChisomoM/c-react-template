
// import { CorporateRegistrationModal } from './CorporateRegistrationModal';
import { LoginPage } from '../(admin)/admin/LoginPage';
import { useState } from 'react';

export default function Login() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <LoginPage onSignUpClick={() => setModalOpen(true)} />
      {/* <CorporateRegistrationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
      /> */}
    </>
  );
}
