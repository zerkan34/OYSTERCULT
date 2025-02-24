import { render, screen, fireEvent } from '@testing-library/react';
import { Schedule } from '../Schedule';
import { useStore } from '@/lib/store';

// Mock the store
jest.mock('@/lib/store', () => ({
  useStore: jest.fn()
}));

describe('Schedule Component', () => {
  const mockEmployee = {
    id: '1',
    name: 'Jean Dupont'
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock store default values
    (useStore as jest.Mock).mockReturnValue({
      session: { user: { role: 'admin' } }
    });
  });

  it('renders employee name and schedule correctly', () => {
    render(<Schedule employee={mockEmployee} onClose={mockOnClose} />);
    
    // Check employee name is displayed
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    
    // Check schedule grid is rendered
    expect(screen.getByText('Matin')).toBeInTheDocument();
    expect(screen.getByText('Après-midi')).toBeInTheDocument();
  });

  it('allows editing time slots when clicking on them', () => {
    render(<Schedule employee={mockEmployee} onClose={mockOnClose} />);
    
    // Click on a morning slot
    const morningSlot = screen.getAllByText('Matin')[0];
    fireEvent.click(morningSlot);
    
    // Check if editor appears
    expect(screen.getByLabelText('Début')).toBeInTheDocument();
    expect(screen.getByLabelText('Fin')).toBeInTheDocument();
    expect(screen.getByText('Enregistrer')).toBeInTheDocument();
  });

  it('allows navigation between weeks', () => {
    render(<Schedule employee={mockEmployee} onClose={mockOnClose} />);
    
    // Get navigation buttons
    const prevWeekButton = screen.getByLabelText('Semaine précédente');
    const nextWeekButton = screen.getByLabelText('Semaine suivante');
    
    // Navigate weeks
    fireEvent.click(nextWeekButton);
    fireEvent.click(prevWeekButton);
  });

  it('closes the schedule when clicking the close button', () => {
    render(<Schedule employee={mockEmployee} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('Fermer');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles time slot deletion', () => {
    render(<Schedule employee={mockEmployee} onClose={mockOnClose} />);
    
    // Click on a morning slot
    const morningSlot = screen.getAllByText('Matin')[0];
    fireEvent.click(morningSlot);
    
    // Check if delete button appears for existing slots
    const deleteButton = screen.getByLabelText('Supprimer le créneau');
    fireEvent.click(deleteButton);
    
    // Verify slot is removed
    expect(screen.queryByText('08:00 - 12:00')).not.toBeInTheDocument();
  });
});