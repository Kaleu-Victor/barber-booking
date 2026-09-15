export const initialScheduleConfig = [
  {
    dayOfWeek: 1,
    dayName: 'Segunda-feira',
    shortName: 'SEG',
    enabled: true,
    startTime: '08:00',
    endTime: '19:00',
    breaks: [
      { id: 'break-1-1', startTime: '12:00', endTime: '13:00' },
    ],
  },
  {
    dayOfWeek: 2,
    dayName: 'Terça-feira',
    shortName: 'TER',
    enabled: true,
    startTime: '08:00',
    endTime: '19:00',
    breaks: [
      { id: 'break-2-1', startTime: '12:00', endTime: '13:00' },
    ],
  },
  {
    dayOfWeek: 3,
    dayName: 'Quarta-feira',
    shortName: 'QUA',
    enabled: true,
    startTime: '08:00',
    endTime: '19:00',
    breaks: [
      { id: 'break-3-1', startTime: '12:00', endTime: '13:00' },
    ],
  },
  {
    dayOfWeek: 4,
    dayName: 'Quinta-feira',
    shortName: 'QUI',
    enabled: true,
    startTime: '08:00',
    endTime: '19:00',
    breaks: [
      { id: 'break-4-1', startTime: '12:00', endTime: '13:00' },
    ],
  },
  {
    dayOfWeek: 5,
    dayName: 'Sexta-feira',
    shortName: 'SEX',
    enabled: true,
    startTime: '08:00',
    endTime: '20:00',
    breaks: [
      { id: 'break-5-1', startTime: '12:00', endTime: '13:00' },
      { id: 'break-5-2', startTime: '16:30', endTime: '17:00' },
    ],
  },
  {
    dayOfWeek: 6,
    dayName: 'Sábado',
    shortName: 'SÁB',
    enabled: true,
    startTime: '08:00',
    endTime: '16:00',
    breaks: [
      { id: 'break-6-1', startTime: '12:00', endTime: '12:30' },
    ],
  },
  {
    dayOfWeek: 0,
    dayName: 'Domingo',
    shortName: 'DOM',
    enabled: false,
    startTime: '09:00',
    endTime: '13:00',
    breaks: [],
  },
]
