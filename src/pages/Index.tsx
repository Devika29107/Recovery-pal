import { Dashboard } from "../components/Dashboard";


interface IndexProps {
  gender?: 'male' | 'female';
  onLogout?: () => void;
}

const Index = ({ gender, onLogout }: IndexProps) => {
  return <Dashboard initialGender={gender} onLogout={onLogout} />;
};

export default Index;
