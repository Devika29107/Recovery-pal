import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { RecoveryPal } from "./RecoveryPal";
import { MedicationCard } from "./MedicationCard";
import { Button } from "@/components/ui/button";
import { AddMedicineDialog } from "./AddMedicineDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, TrendingUp } from "lucide-react";
import { ProgressReport } from "./ProgressReport";
import { CalendarView } from "./CalendarView";
import { toast } from "@/hooks/use-toast";

// Mock data - in a real app this would come from an API
const initialMedications = [
  {
    id: "1",
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "3x daily",
    nextDose: "2:00 PM",
    takenToday: false,
    color: "#3B82F6"
  },
  {
    id: "2", 
    name: "Vitamin D",
    dosage: "1000 IU",
    frequency: "1x daily",
    nextDose: "Morning",
    takenToday: true,
    color: "#F59E0B"
  },
  {
    id: "3",
    name: "Ibuprofen",
    dosage: "200mg", 
    frequency: "As needed",
    nextDose: "Available",
    takenToday: false,
    color: "#EF4444"
  }
];

interface DashboardProps {
  initialGender?: 'male' | 'female';
  onLogout?: () => void;
}

export const Dashboard = ({ initialGender = 'male', onLogout }: DashboardProps) => {
  const [medications, setMedications] = useState(initialMedications);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [progressReportOpen, setProgressReportOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [adherenceLevel, setAdherenceLevel] = useState(65);
  const [streak, setStreak] = useState(3);
  const [gender, setGender] = useState<'male' | 'female'>(initialGender);

  const handleTakeDose = (medicationId: string) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? { ...med, takenToday: true }
          : med
      )
    );

    // Update adherence level
    const totalMeds = medications.length;
    const takenMeds = medications.filter(med => med.takenToday || med.id === medicationId).length;
    const newAdherence = Math.round((takenMeds / totalMeds) * 100);
    setAdherenceLevel(newAdherence);

    // Update streak if all medications taken
    if (takenMeds === totalMeds) {
      setStreak(prev => prev + 1);
      toast({
        title: "Perfect day! 🎉",
        description: "All medications taken. Your Recovery Pal is getting stronger!",
      });
    } else {
      toast({
        title: "Great job! 💊",
        description: "Dose logged. Keep up the good work!",
      });
    }
  };

  const completedToday = medications.filter(med => med.takenToday).length;
  const totalMedications = medications.length;

  // Determine if any medication is missed
  const missedDose = medications.some(med => !med.takenToday);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Recovery Pal</h1>
              <p className="text-muted-foreground">Your healing journey companion</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="healing" size="sm" onClick={() => setAddDialogOpen(true)}>
                <Plus className="w-4 h-4" />
                Add Medicine
              </Button>
              {onLogout && (
                <Button variant="outline" size="sm" onClick={onLogout} className="ml-2">Logout</Button>
              )}
            </div>
            <AddMedicineDialog
              open={addDialogOpen}
              onOpenChange={setAddDialogOpen}
              onAddMedicine={(medicine) => {
                setMedications((prev) => [
                  ...prev,
                  {
                    id: (prev.length + 1).toString(),
                    takenToday: false,
                    nextDose: "Set time",
                    ...medicine,
                  },
                ]);
              }}
            />
          </div>
        </div>
      </header>

  <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Recovery Pal Avatar Section */}
        <Card className="bg-recovery-gradient border-none shadow-healing">
          <CardContent className="pt-8">
            <div className="flex flex-col items-center space-y-4">
              <ToggleGroup type="single" value={gender} onValueChange={val => val && setGender(val as 'male' | 'female')}>
                <ToggleGroupItem value="male" aria-label="Male AI" className="px-4">Male</ToggleGroupItem>
                <ToggleGroupItem value="female" aria-label="Female AI" className="px-4">Female</ToggleGroupItem>
              </ToggleGroup>
              <RecoveryPal 
                adherenceLevel={adherenceLevel}
                streak={streak}
                className="text-center"
                missedDose={missedDose}
                gender={gender}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {completedToday}/{totalMedications}
              </div>
              <p className="text-xs text-muted-foreground">medications taken</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{streak}</div>
              <p className="text-xs text-muted-foreground">perfect days</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{adherenceLevel}%</div>
              <p className="text-xs text-muted-foreground">overall progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Medications List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Medications</h2>
            <div className="text-sm text-muted-foreground">
              {completedToday} of {totalMedications} completed today
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medications.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onTakeDose={handleTakeDose}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col space-y-2"
                onClick={() => setCalendarOpen(true)}
              >
                <Calendar className="w-6 h-6" />
                <span>View Calendar</span>
                <span className="text-xs text-muted-foreground">See your schedule</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col space-y-2"
                onClick={() => setProgressReportOpen(true)}
              >
                <TrendingUp className="w-6 h-6" />
                <span>Progress Report</span>
                <span className="text-xs text-muted-foreground">Track your journey</span>
              </Button>
              
              <ProgressReport
                open={progressReportOpen}
                onOpenChange={setProgressReportOpen}
                medications={medications}
                adherenceLevel={adherenceLevel}
                streak={streak}
              />
              
              <CalendarView
                open={calendarOpen}
                onOpenChange={setCalendarOpen}
                medications={medications}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
