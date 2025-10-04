import { useMemo, useState } from 'react'

type PreparednessModalProps = {
  open: boolean
  onClose: () => void
}

type ScenarioKey = 'continental' | 'oceánico' | 'urbano'

type IndustryImpact = {
  sector: string
  impacto: string
  recomendaciones: string
}

const scenarioLabels: Record<ScenarioKey, string> = {
  continental: 'Impacto continental',
  oceánico: 'Impacto oceánico',
  urbano: 'Impacto en zona urbana'
}

const scenarioSummaries: Record<ScenarioKey, string> = {
  continental:
    'Un impacto en tierra firme puede generar ondas de choque y eyecciones de material que afectan extensas áreas rurales y agrícolas.',
  oceánico:
    'El impacto en el océano crea tsunamis y alteraciones en cadenas de suministro marítimo y puertos regionales.',
  urbano:
    'Los centros urbanos concentran población y servicios críticos, por lo que requieren planes detallados de evacuación y continuidad operativa.'
}

const scenarioIndustries: Record<ScenarioKey, IndustryImpact[]> = {
  continental: [
    {
      sector: 'Agricultura',
      impacto: 'Pérdida de cultivos por onda expansiva y contaminación de suelos.',
      recomendaciones: 'Activar planes de contingencia alimentaria y asegurar reservas estratégicas.'
    },
    {
      sector: 'Transporte terrestre',
      impacto: 'Interrupción de carreteras y vías férreas clave para distribución.',
      recomendaciones: 'Identificar rutas alternas y coordinar con protección civil.'
    },
    {
      sector: 'Energía',
      impacto: 'Daños potenciales a líneas de transmisión y subestaciones regionales.',
      recomendaciones: 'Desconectar áreas vulnerables y desplegar equipos de reparación móvil.'
    }
  ],
  oceánico: [
    {
      sector: 'Pesca y acuicultura',
      impacto: 'Oleaje extremo y alteración de ecosistemas costeros.',
      recomendaciones: 'Suspender operaciones y reubicar embarcaciones a puertos seguros.'
    },
    {
      sector: 'Logística portuaria',
      impacto: 'Cierres de puertos y daños a infraestructura marítima.',
      recomendaciones: 'Redirigir cargas a puertos alternos y coordinar con autoridades navales.'
    },
    {
      sector: 'Turismo costero',
      impacto: 'Evacuación masiva y cancelaciones por riesgos de tsunami.',
      recomendaciones: 'Implementar planes de comunicación para visitantes y asegurar rutas de evacuación.'
    }
  ],
  urbano: [
    {
      sector: 'Servicios de salud',
      impacto: 'Sobrecarga hospitalaria y necesidad de triage masivo.',
      recomendaciones: 'Habilitar hospitales de campaña y reforzar cadenas de suministro médico.'
    },
    {
      sector: 'Telecomunicaciones',
      impacto: 'Interrupción de redes móviles y de datos que soportan servicios críticos.',
      recomendaciones: 'Desplegar unidades móviles de comunicaciones y redundancias satelitales.'
    },
    {
      sector: 'Finanzas',
      impacto: 'Cierre temporal de mercados y vulnerabilidad de infraestructura bancaria.',
      recomendaciones: 'Activar planes de continuidad de negocio y respaldos fuera de sitio.'
    }
  ]
}

export default function PreparednessModal({ open, onClose }: PreparednessModalProps) {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('continental')

  const industries = useMemo(() => scenarioIndustries[selectedScenario], [selectedScenario])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8">
      <div className="panel max-w-3xl w-full max-h-full overflow-y-auto rounded-3xl border border-white/10">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <h2 className="text-2xl font-semibold">Guía ante un posible impacto</h2>
            <p className="label mt-1">
              Información recomendada para autoridades y público general, junto con datos clave para la toma de decisiones.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-3 py-1 text-sm hover:border-white/40 transition-colors"
            aria-label="Cerrar modal"
          >
            Cerrar
          </button>
        </div>

        <div className="space-y-6 p-6">
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Acciones inmediatas para la población</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/80">
              <li>Seguir los canales oficiales de protección civil y evitar la difusión de rumores.</li>
              <li>Preparar un kit de emergencia con agua, alimentos no perecederos, linternas y botiquín.</li>
              <li>Definir puntos de encuentro familiares y rutas de evacuación alternativas.</li>
              <li>Proteger documentación importante en formatos digitales y físicos resistentes.</li>
              <li>Atender indicaciones sobre refugios temporales y horarios de desplazamiento seguros.</li>
            </ul>
          </section>

          <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">Recomendaciones para autoridades</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/80">
                <li>Activar centros de operación de emergencia y coordinar con agencias científicas.</li>
                <li>Monitorear modelos de trayectoria y actualizar escenarios cada 30 minutos.</li>
                <li>Priorizar la protección de infraestructuras críticas y redes de comunicación.</li>
                <li>Emitir boletines bilingües y accesibles para comunidades vulnerables.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Recursos sugeridos</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/80">
                <li>Dashboard de la NASA (Sentry II) para seguimiento de objetos cercanos.</li>
                <li>Red Internacional de Alerta de Tsunamis para impactos oceánicos.</li>
                <li>Plataformas de mapas de riesgo locales (OpenData, IDEs estatales).</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Análisis de impacto por industria</h3>
                <p className="label">Selecciona el escenario para ver sectores críticos y recomendaciones.</p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <span className="label">Escenario</span>
                <select
                  value={selectedScenario}
                  onChange={event => setSelectedScenario(event.target.value as ScenarioKey)}
                  className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-sm focus:border-white/40 focus:outline-none"
                >
                  {Object.entries(scenarioLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className="text-sm text-white/80">{scenarioSummaries[selectedScenario]}</p>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
                  <tr>
                    <th scope="col" className="px-4 py-3">Sector</th>
                    <th scope="col" className="px-4 py-3">Impacto esperado</th>
                    <th scope="col" className="px-4 py-3">Recomendaciones clave</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {industries.map(industry => (
                    <tr key={industry.sector} className="bg-black/30">
                      <td className="px-4 py-3 font-medium text-white/90">{industry.sector}</td>
                      <td className="px-4 py-3 text-white/75">{industry.impacto}</td>
                      <td className="px-4 py-3 text-white/75">{industry.recomendaciones}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Comunicación y seguimiento</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/80">
              <li>Establecer ventanas horarias para actualizaciones públicas y conferencias de prensa.</li>
              <li>Compartir mapas de zonas de riesgo y rutas de evacuación en formatos accesibles.</li>
              <li>Integrar datos de sensores locales, reportes comunitarios y satélites para validar daños.</li>
              <li>Registrar lecciones aprendidas en plataformas colaborativas para futuras mejoras.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
