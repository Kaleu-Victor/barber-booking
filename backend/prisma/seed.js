/**
 * Seed inicial do banco de dados.
 * Popula com o barbeiro padrão, serviços e configuração de horários
 * espelhando os dados que existiam como mock no frontend.
 *
 * Execute com: npm run db:seed
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // ─── Barbeiro padrão ──────────────────────────────────────────────────────
  const barber = await prisma.barber.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'João' },
  })

  console.log(`✓ Barbeiro criado: ${barber.name} (id: ${barber.id})`)

  // ─── Serviços ─────────────────────────────────────────────────────────────
  const servicesData = [
    {
      name: 'Corte Tradicional',
      description: 'Corte personalizado de acordo com seu estilo.',
      durationMinutes: 30,
      priceInCents: 3000,
    },
    {
      name: 'Corte + Barba',
      description: 'Corte completo acompanhado de acabamento da barba.',
      durationMinutes: 50,
      priceInCents: 4500,
    },
    {
      name: 'Barba',
      description: 'Modelagem e acabamento para sua barba.',
      durationMinutes: 20,
      priceInCents: 2000,
    },
  ]

  // Remove serviços anteriores do barbeiro e recria
  await prisma.service.deleteMany({ where: { barberId: barber.id } })

  for (const serviceData of servicesData) {
    const service = await prisma.service.create({
      data: { barberId: barber.id, ...serviceData },
    })
    console.log(`✓ Serviço criado: ${service.name}`)
  }

  // ─── Horários de funcionamento ────────────────────────────────────────────
  // Espelha o initialScheduleConfig do frontend
  const scheduleData = [
    {
      dayOfWeek: 0, // Domingo
      enabled: false,
      startTime: '09:00',
      endTime: '13:00',
      breaks: [],
    },
    {
      dayOfWeek: 1, // Segunda
      enabled: true,
      startTime: '08:00',
      endTime: '19:00',
      breaks: [{ startTime: '12:00', endTime: '13:00' }],
    },
    {
      dayOfWeek: 2, // Terça
      enabled: true,
      startTime: '08:00',
      endTime: '19:00',
      breaks: [{ startTime: '12:00', endTime: '13:00' }],
    },
    {
      dayOfWeek: 3, // Quarta
      enabled: true,
      startTime: '08:00',
      endTime: '19:00',
      breaks: [{ startTime: '12:00', endTime: '13:00' }],
    },
    {
      dayOfWeek: 4, // Quinta
      enabled: true,
      startTime: '08:00',
      endTime: '19:00',
      breaks: [{ startTime: '12:00', endTime: '13:00' }],
    },
    {
      dayOfWeek: 5, // Sexta
      enabled: true,
      startTime: '08:00',
      endTime: '20:00',
      breaks: [
        { startTime: '12:00', endTime: '13:00' },
        { startTime: '16:30', endTime: '17:00' },
      ],
    },
    {
      dayOfWeek: 6, // Sábado
      enabled: true,
      startTime: '08:00',
      endTime: '16:00',
      breaks: [{ startTime: '12:00', endTime: '12:30' }],
    },
  ]

  const DAY_NAMES = {
    0: 'Domingo',
    1: 'Segunda-feira',
    2: 'Terça-feira',
    3: 'Quarta-feira',
    4: 'Quinta-feira',
    5: 'Sexta-feira',
    6: 'Sábado',
  }

  for (const dayData of scheduleData) {
    const { breaks, ...workingHourData } = dayData

    // Upsert: cria ou atualiza o registro do dia
    const workingHour = await prisma.workingHour.upsert({
      where: {
        barberId_dayOfWeek: {
          barberId: barber.id,
          dayOfWeek: dayData.dayOfWeek,
        },
      },
      update: {
        enabled: workingHourData.enabled,
        startTime: workingHourData.startTime,
        endTime: workingHourData.endTime,
        breaks: {
          deleteMany: {},
          create: breaks,
        },
      },
      create: {
        barberId: barber.id,
        ...workingHourData,
        breaks: { create: breaks },
      },
    })

    console.log(
      `✓ Horário: ${DAY_NAMES[workingHour.dayOfWeek]} (${workingHour.enabled ? 'ativo' : 'inativo'})`,
    )
  }

  console.log('\n✅ Seed concluído com sucesso!')
}

main()
  .catch((err) => {
    console.error('❌ Erro no seed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
