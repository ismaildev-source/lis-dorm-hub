
import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Calendar } from 'lucide-react';

type AttendanceStatus = 'Present' | 'Absent';
type StudyType = 'Prep1 19:10-20:00' | 'Prep2 21:10-22:00' | 'Saturday Study Time' | 'Sunday Study Time' | 'Extra/Special Study Time';
type GradeLevelType = 'Year 9' | 'Year 10' | 'Year 11' | 'Year 12' | 'Year 13';

interface Student {
  id: string;
  name: string;
  grade_level: GradeLevelType;
}

interface AttendanceForm {
  student_id: string;
  attendance_status: AttendanceStatus;
  date: string;
  study_types: StudyType[];
  grade_level: GradeLevelType;
  absent_reason: string;
  is_late: boolean;
  is_noise: boolean;
  is_leave_early: boolean;
  is_doing_nothing: boolean;
  comments: string;
}

interface SupervisorAttendanceFormProps {
  students: Student[];
  attendanceForm: AttendanceForm;
  loading: boolean;
  onStudentChange: (studentId: string) => void;
  onFormChange: (updates: Partial<AttendanceForm>) => void;
  onStudyTypeChange: (studyType: StudyType, checked: boolean) => void;
  onSubmit: () => void;
}

const SupervisorAttendanceForm: React.FC<SupervisorAttendanceFormProps> = ({
  students,
  attendanceForm,
  loading,
  onStudentChange,
  onFormChange,
  onStudyTypeChange,
  onSubmit
}) => {
  const studyTypeOptions: StudyType[] = [
    'Prep1 19:10-20:00',
    'Prep2 21:10-22:00',
    'Saturday Study Time',
    'Sunday Study Time',
    'Extra/Special Study Time'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Take Attendance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="student">Student</Label>
          <Select value={attendanceForm.student_id} onValueChange={onStudentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.grade_level})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="attendance-status">Attendance Status</Label>
          <Select 
            value={attendanceForm.attendance_status} 
            onValueChange={(value: AttendanceStatus) => onFormChange({attendance_status: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={attendanceForm.date}
            onChange={(e) => onFormChange({date: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Study Type</Label>
          <div className="flex flex-wrap gap-4">
            {studyTypeOptions.map((studyType) => (
              <div key={studyType} className="flex items-center space-x-2">
                <Checkbox
                  id={studyType}
                  checked={attendanceForm.study_types.includes(studyType)}
                  onCheckedChange={(checked) => onStudyTypeChange(studyType, !!checked)}
                />
                <Label htmlFor={studyType} className="whitespace-nowrap text-sm">
                  {studyType}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {attendanceForm.attendance_status === 'Absent' && (
          <div>
            <Label htmlFor="absent-reason">Absent Reason</Label>
            <Input
              id="absent-reason"
              value={attendanceForm.absent_reason}
              onChange={(e) => onFormChange({absent_reason: e.target.value})}
              placeholder="Enter reason for absence"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Behavioral Notes</Label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="late"
                checked={attendanceForm.is_late}
                onCheckedChange={(checked) => onFormChange({is_late: !!checked})}
              />
              <Label htmlFor="late">Late</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="noise"
                checked={attendanceForm.is_noise}
                onCheckedChange={(checked) => onFormChange({is_noise: !!checked})}
              />
              <Label htmlFor="noise">Noise</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="leave-early"
                checked={attendanceForm.is_leave_early}
                onCheckedChange={(checked) => onFormChange({is_leave_early: !!checked})}
              />
              <Label htmlFor="leave-early">Leave Early</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="doing-nothing"
                checked={attendanceForm.is_doing_nothing}
                onCheckedChange={(checked) => onFormChange({is_doing_nothing: !!checked})}
              />
              <Label htmlFor="doing-nothing">Doing Nothing</Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="comments">Comments</Label>
          <Textarea
            id="comments"
            value={attendanceForm.comments}
            onChange={(e) => onFormChange({comments: e.target.value})}
            placeholder="Enter any additional comments..."
            rows={3}
          />
        </div>

        <Button 
          onClick={onSubmit} 
          className="w-full"
          disabled={loading || !attendanceForm.student_id || attendanceForm.study_types.length === 0}
        >
          Submit Attendance
        </Button>
      </CardContent>
    </Card>
  );
};

export default SupervisorAttendanceForm;
