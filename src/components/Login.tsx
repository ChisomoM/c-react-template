
// import { CorporateRegistrationModal } from './CorporateRegistrationModal';
import { LoginPage } from '@/app/(admin)/admin/LoginPage';
import { useState } from 'react';

export default function Login() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <LoginPage />
      {/* <CorporateRegistrationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
      /> */}
    </>
  );
}
