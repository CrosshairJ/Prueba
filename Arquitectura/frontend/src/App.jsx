import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { useTransporteStore, RUTA_TALCA, CATALOGO_RUTAS } from './store';

// Icono cuadrado 
const crearIconoBusFlotante = (bus) => {
  const enMovimiento = bus.estado?.toLowerCase().includes('movimiento');
  const finalizado = bus.estado?.toLowerCase().includes('finalizado');
  const claseEstado = finalizado ? 'fin' : enMovimiento ? 'movimiento' : 'espera';

  return L.divIcon({
    className: 'contenedor-icono-bus',
    iconSize: [200, 80],
    iconAnchor: [22, 68],
    html: `
      <div class="wrapper-bus-mapa">
        <div class="tarjeta-flotante-bus ${claseEstado}">
          <div class="cabecera-flotante-bus">
            <span class="id-bus-flotante">${bus.busId}</span>
            <span class="badge-linea-bus">Línea 101</span>
          </div>
          <div class="estado-bus-flotante">${bus.estado}</div>
          <div class="pasajero-bus-flotante">👤 ${bus.pasajero}</div>
        </div>
        <div class="cuadrado-icono-bus ${claseEstado}">
          <span>🚌</span>
        </div>
      </div>
    `,
  });
};

export default function App() {
  const {
    usuario,
    error,
    bus,
    filtroRuta,
    setFiltroRuta,
    iniciarSesion,
    cerrarSesion,
    solicitarBusDesdeCelular,
    tomarBusDesdeCelular,
  } = useTransporteStore();

  const [correo, setCorreo] = useState('pasajero@app.cl');
  const [clave, setClave] = useState('123');
  const [seccionActiva, setSeccionActiva] = useState('vehiculos');

  const handleSubmit = (e) => {
    e.preventDefault();
    iniciarSesion(correo, clave);
  };

  if (!usuario) {
    return (
      <div className="contenedor-login">
        <div className="tarjeta-login">
          <div className="cabecera-login">
            <span className="icono-sistema">🚍</span>
            <h1>Transporte Inteligente</h1>
            <p>Plataforma de Gestión y Movilidad Urbana</p>
          </div>

          <div className="selector-perfil">
            <button
              type="button"
              className={correo === 'pasajero@app.cl' ? 'btn-perfil activo' : 'btn-perfil'}
              onClick={() => {
                setCorreo('pasajero@app.cl');
                setClave('123');
              }}
            >
              Modo Pasajero
            </button>
            <button
              type="button"
              className={correo === 'conductor@app.cl' ? 'btn-perfil activo' : 'btn-perfil'}
              onClick={() => {
                setCorreo('conductor@app.cl');
                setClave('123');
              }}
            >
              Modo Operador / Conductor
            </button>
          </div>

          <form className="formulario-login" onSubmit={handleSubmit}>
            <div className="grupo-input">
              <label>Correo Electrónico</label>
              <input
                type="email"
                placeholder="nombre@dominio.cl"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="grupo-input">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
              />
            </div>

            {error && <div className="alerta-error">{error}</div>}

            <button type="submit" className="btn-ingresar">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  const esConductor =
    usuario.rol?.toLowerCase().includes('conductor') ||
    usuario.rol?.toLowerCase().includes('operador') ||
    correo === 'conductor@app.cl';

  const rutasVisibles =
    esConductor && seccionActiva === 'rutas'
      ? CATALOGO_RUTAS.filter((r) => filtroRuta === 'todas' || r.id === filtroRuta)
      : CATALOGO_RUTAS.filter((r) => r.activa);

  return (
    <div className="layout-principal">
      <header className="barra-superior">
        <div className="marca-sistema">
          <span className="punto-estado"></span>
          <h1>TRANSPORTE INTELIGENTE</h1>
        </div>

        <div className="info-operador">
          <span className="texto-operador">
            {esConductor ? 'Operador:' : 'Pasajero:'} <strong>{usuario.nombre}</strong>
          </span>
          <span className="badge-rol">{usuario.rol}</span>
          <button onClick={cerrarSesion} className="btn-salir">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="cuerpo-dashboard">
        {esConductor ? (
          <aside className="menu-lateral">
            <nav className="lista-navegacion">
              <button
                className={seccionActiva === 'vehiculos' ? 'item-nav activo' : 'item-nav'}
                onClick={() => setSeccionActiva('vehiculos')}
              >
                <span className="icono-nav">🚌</span>
                <span>Vehículos</span>
              </button>
              <button
                className={seccionActiva === 'rutas' ? 'item-nav activo' : 'item-nav'}
                onClick={() => setSeccionActiva('rutas')}
              >
                <span className="icono-nav">🗺️</span>
                <span>Rutas</span>
              </button>
              <button
                className={seccionActiva === 'incidentes' ? 'item-nav activo' : 'item-nav'}
                onClick={() => setSeccionActiva('incidentes')}
              >
                <span className="icono-nav">⚠️</span>
                <span>Incidentes</span>
              </button>
              <button
                className={seccionActiva === 'alertas' ? 'item-nav activo' : 'item-nav'}
                onClick={() => setSeccionActiva('alertas')}
              >
                <span className="icono-nav">🔔</span>
                <span>Alertas</span>
              </button>
              <button
                className={seccionActiva === 'reportes' ? 'item-nav activo' : 'item-nav'}
                onClick={() => setSeccionActiva('reportes')}
              >
                <span className="icono-nav">📊</span>
                <span>Reportes</span>
              </button>
            </nav>

            {seccionActiva === 'rutas' && (
              <div className="panel-catalogo-rutas">
                <span className="titulo-seccion-lateral">Red de Rutas Talca</span>
                <button
                  className={filtroRuta === 'todas' ? 'item-ruta-btn activo' : 'item-ruta-btn'}
                  onClick={() => setFiltroRuta('todas')}
                >
                  Ver todas las líneas (3)
                </button>
                {CATALOGO_RUTAS.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setFiltroRuta(r.id)}
                    className={`tarjeta-ruta-item ${filtroRuta === r.id ? 'seleccionada' : ''}`}
                  >
                    <div className="cabecera-ruta-item">
                      <span className="indicador-color-ruta" style={{ backgroundColor: r.color }} />
                      <strong>Línea {r.id}</strong>
                      <span className={r.activa ? 'tag-ruta activa' : 'tag-ruta proyectada'}>
                        {r.activa ? 'Activa' : 'Integración'}
                      </span>
                    </div>
                    <p>{r.nombre}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="bloques-control-inferior">
              <div className="caja-accion-conductor">
                <span className="titulo-accion-rol">Control del Conductor</span>
                <button
                  onClick={tomarBusDesdeCelular}
                  disabled={!bus}
                  className="btn-conductor-iniciar"
                >
                  ▶ Iniciar Recorrido
                </button>
              </div>

              {/* Cuadro bus de prueba */}
              <div className="caja-testeo">
                <span className="titulo-testeo">Poner bus de prueba</span>
                <button onClick={solicitarBusDesdeCelular} className="btn-testeo">
                  🚌 Poner bus de prueba
                </button>
              </div>
            </div>
          </aside>
        ) : (
          <aside className="panel-pasajero">
            <div className="tarjeta-movil">
              <h2>Mi Viaje</h2>
              <p className="subtitulo-movil">Aborda tu unidad asignada en el paradero</p>

              <div className="estado-viaje-pasajero">
                {bus ? (
                  <>
                    <div className="fila-dato">
                      <span>Unidad asignada</span>
                      <strong>{bus.busId} (Línea 101)</strong>
                    </div>
                    <div className="fila-dato">
                      <span>Estado actual</span>
                      <strong className="texto-destacado">{bus.estado}</strong>
                    </div>
                    <div className="fila-dato">
                      <span>Ubicación GPS</span>
                      <strong>
                        {bus.lat.toFixed(4)}, {bus.lng.toFixed(4)}
                      </strong>
                    </div>
                  </>
                ) : (
                  <p className="sin-unidad">
                    No hay buses en el paradero. Usa el cuadro inferior para poner un bus de prueba.
                  </p>
                )}
              </div>

              {/* Pasajero */}
              <div className="acciones-pasajero">
                <button
                  onClick={tomarBusDesdeCelular}
                  disabled={!bus}
                  className="btn-secundario-pasajero"
                >
                  🎟️ Tomar Bus
                </button>
              </div>
            </div>

            <div className="caja-testeo">
              <span className="titulo-testeo">Poner bus de prueba</span>
              <button onClick={solicitarBusDesdeCelular} className="btn-testeo">
                🚌 Poner bus de prueba
              </button>
            </div>
          </aside>
        )}

        <main className="zona-mapa">
          {esConductor && seccionActiva !== 'vehiculos' && (
            <div className="panel-flotante-info">
              {seccionActiva === 'rutas' && (
                <div>
                  <h4>Trazado Troncal y Líneas de Integración</h4>
                  <p>
                    <strong>Línea 101</strong> (continua azul) en operación activa.{' '}
                    <strong>Líneas 203 y 305</strong> (segmentadas) listas para integración.
                  </p>
                </div>
              )}
              {seccionActiva === 'incidentes' && (
                <div>
                  <h4>Control de Incidentes</h4>
                  <p>Sin desvíos críticos reportados por los conductores en la red.</p>
                </div>
              )}
              {seccionActiva === 'alertas' && (
                <div>
                  <h4>Centro de Alertas</h4>
                  <p>Velocidad y frecuencia de unidades dentro del rango operativo (&lt; 3s).</p>
                </div>
              )}
              {seccionActiva === 'reportes' && (
                <div>
                  <h4>Resumen Operativo</h4>
                  <p>Sincronización híbrida PostgreSQL / SQLite / Redis operativa.</p>
                </div>
              )}
            </div>
          )}

          <MapContainer
            center={[-35.4264, -71.6554]}
            zoom={15}
            className="visor-leaflet"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {rutasVisibles.map((ruta) => (
              <Polyline
                key={ruta.id}
                positions={ruta.coordenadas}
                pathOptions={{
                  color: ruta.color,
                  weight: ruta.activa ? 5 : 4,
                  opacity: ruta.activa ? 0.9 : 0.65,
                  dashArray: ruta.activa ? undefined : '8, 8',
                }}
              >
                <Tooltip sticky>
                  <strong>{ruta.nombre}</strong> ({ruta.estado})
                </Tooltip>
              </Polyline>
            ))}

            {seccionActiva === 'rutas' &&
              RUTA_TALCA.map((coord, idx) => (
                <CircleMarker
                  key={idx}
                  center={coord}
                  radius={5}
                  pathOptions={{ color: '#0f172a', fillColor: '#38bdf8', fillOpacity: 1, weight: 2 }}
                >
                  <Tooltip direction="top">
                    Paradero #{idx + 1} — Línea 101
                  </Tooltip>
                </CircleMarker>
              ))}

            
            {bus && (
              <Marker
                position={[bus.lat, bus.lng]}
                icon={crearIconoBusFlotante(bus)}
              />
            )}
          </MapContainer>
        </main>
      </div>

      {esConductor && (
        <footer className="barra-metricas">
          <div className="tarjeta-metrica">
            <span className="etiqueta-metrica">VEHÍCULOS ACTIVOS:</span>
            <strong className="valor-metrica azul">{bus ? 1 : 0}</strong>
            <span className="icono-metrica">🚌</span>
          </div>

          <div className="tarjeta-metrica">
            <span className="etiqueta-metrica">INCIDENTES:</span>
            <strong className="valor-metrica rojo">0</strong>
            <span className="icono-metrica">🚨</span>
          </div>

          <div className="tarjeta-metrica">
            <span className="etiqueta-metrica">ALERTAS:</span>
            <strong className="valor-metrica ambar">{bus ? 1 : 0}</strong>
            <span className="icono-metrica">🔔</span>
          </div>
        </footer>
      )}
    </div>
  );
}