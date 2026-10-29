import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { useTransporteStore } from './store';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});

const RUTA_TALCA = [
  [-35.4264, -71.6660],
  [-35.4264, -71.6554],
  [-35.4230, -71.6554],
  [-35.4230, -71.6480],
];

export default function App() {
  const {
    usuario,
    error,
    bus,
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

            <div className="caja-testeo">
              <span className="titulo-testeo">Testeo</span>
              <button onClick={solicitarBusDesdeCelular} className="btn-testeo">
                Pedir Bus
              </button>
              <button
                onClick={tomarBusDesdeCelular}
                disabled={!bus}
                className="btn-testeo btn-testeo-iniciar"
              >
                Empezar Recorrido
              </button>
            </div>
          </aside>
        ) : (
          <aside className="panel-pasajero">
            <div className="tarjeta-movil">
              <h2>Mi Viaje</h2>
              <p className="subtitulo-movil">Solicita una unidad cercana a tu ubicación actual</p>

              <div className="estado-viaje-pasajero">
                {bus ? (
                  <>
                    <div className="fila-dato">
                      <span>Unidad asignada</span>
                      <strong>{bus.busId}</strong>
                    </div>
                    <div className="fila-dato">
                      <span>Estado actual</span>
                      <strong className="texto-destacado">{bus.estado}</strong>
                    </div>
                    <div className="fila-dato">
                      <span>Ubicación</span>
                      <strong>
                        {bus.lat.toFixed(4)}, {bus.lng.toFixed(4)}
                      </strong>
                    </div>
                  </>
                ) : (
                  <p className="sin-unidad">No tienes viajes activos en este momento.</p>
                )}
              </div>

              <div className="acciones-pasajero">
                <button onClick={solicitarBusDesdeCelular} className="btn-principal-pasajero">
                  Pedir Bus
                </button>
                <button
                  onClick={tomarBusDesdeCelular}
                  disabled={!bus}
                  className="btn-secundario-pasajero"
                >
                  Abordar / Iniciar Viaje
                </button>
              </div>
            </div>

            <div className="caja-testeo">
              <span className="titulo-testeo">Testeo</span>
              <button onClick={solicitarBusDesdeCelular} className="btn-testeo">
                Pedir Bus
              </button>
              <button
                onClick={tomarBusDesdeCelular}
                disabled={!bus}
                className="btn-testeo btn-testeo-iniciar"
              >
                Empezar Recorrido
              </button>
            </div>
          </aside>
        )}

        <main className="zona-mapa">
          {esConductor && (
            <div className="panel-flotante-info">
              {seccionActiva === 'vehiculos' && (
                <div>
                  <h4>Monitoreo de Flota</h4>
                  {bus ? (
                    <p>
                      Unidad <strong>{bus.busId}</strong> ({bus.estado}) — Pasajero:{' '}
                      <strong>{bus.pasajero}</strong>
                    </p>
                  ) : (
                    <p>Esperando activación de unidades en ruta.</p>
                  )}
                </div>
              )}
              {seccionActiva === 'rutas' && (
                <div>
                  <h4>Trazado Troncal Talca</h4>
                  <p>Ruta activa con circulación normal en corredor central.</p>
                </div>
              )}
              {seccionActiva === 'incidentes' && (
                <div>
                  <h4>Control de Incidentes</h4>
                  <p>Sin desvíos críticos reportados por los conductores.</p>
                </div>
              )}
              {seccionActiva === 'alertas' && (
                <div>
                  <h4>Centro de Alertas</h4>
                  <p>Velocidad y frecuencia de unidades dentro del rango operativo.</p>
                </div>
              )}
              {seccionActiva === 'reportes' && (
                <div>
                  <h4>Resumen Operativo</h4>
                  <p>Módulo preparado para exportación de métricas de viaje.</p>
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
            <Polyline
              positions={RUTA_TALCA}
              pathOptions={{ color: '#38bdf8', weight: 5, opacity: 0.8 }}
            />
            {bus && (
              <Marker position={[bus.lat, bus.lng]}>
                <Popup>
                  <strong>Unidad: {bus.busId}</strong>
                  <br />
                  Estado: {bus.estado}
                  <br />
                  Pasajero: {bus.pasajero}
                </Popup>
              </Marker>
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