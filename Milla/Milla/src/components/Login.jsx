

import { useState, useEffect } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

import { auth } from "../firebase";

function Login() {

  // Estados de los formularios
  const [modo, setModo] = useState("login");

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  // Mantener la sesión del usuario
  useEffect(() => {

    const escucharUsuario = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });

    return () => escucharUsuario();

  }, []);

  // Cambiar entre registro e inicio de sesión
  const cambiarModo = () => {

    setModo(modo === "login" ? "registro" : "login");

    setNombre("");
    setCorreo("");
    setPassword("");
    setConfirmarPassword("");

    setError("");
    setMensaje("");

  };

  // Registrar usuario
  const registrarUsuario = async (e) => {

    e.preventDefault();

    setError("");
    setMensaje("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    try {

      const resultado = await createUserWithEmailAndPassword(
        auth,
        correo,
        password
      );

      // Guardar el nombre del usuario en su perfil
      await updateProfile(resultado.user, {
        displayName: nombre
      });

      setMensaje("¡Tu cuenta se creó correctamente!");

      setNombre("");
      setCorreo("");
      setPassword("");
      setConfirmarPassword("");

    } catch (error) {

      if (error.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado.");
      } else if (error.code === "auth/invalid-email") {
        setError("El correo electrónico no es válido.");
      } else {
        setError("No se pudo crear la cuenta. Intenta nuevamente.");
      }

    } finally {
      setCargando(false);
    }

  };

  // Iniciar sesión
  const iniciarSesion = async (e) => {

    e.preventDefault();

    setError("");
    setMensaje("");
    setCargando(true);

    try {

      await signInWithEmailAndPassword(
        auth,
        correo,
        password
      );

    } catch (error) {

      if (
        error.code === "auth/invalid-credential"
      ) {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("No se pudo iniciar sesión.");
      }

    } finally {
      setCargando(false);
    }

  };

  // Cerrar sesión
  const cerrarSesion = async () => {

    try {
      await signOut(auth);
      setCorreo("");
      setPassword("");
      setMensaje("");
      setError("");
    } catch (error) {
      setError("No se pudo cerrar la sesión.");
    }

  };

  // Pantalla después de iniciar sesión
  if (usuario) {

    return (

      <div className="bienvenida">

        <div className="icono-bienvenida">
          👋
        </div>

        <h1>¡Hola, {usuario.displayName || "usuario"}!</h1>

        <p>Has iniciado sesión correctamente.</p>

        <div className="datos-usuario">
          <strong>Tu correo:</strong>
          <p>{usuario.email}</p>
        </div>

        <button onClick={cerrarSesion}>
          Cerrar sesión
        </button>

      </div>

    );

  }

  return (

    <div className="login-container">

      <form
        onSubmit={modo === "registro"
          ? registrarUsuario
          : iniciarSesion}
      >

        <h1>
          {modo === "registro"
            ? "Crear cuenta"
            : "¡Bienvenido!"}
        </h1>

        <p>
          {modo === "registro"
            ? "Regístrate para comenzar."
            : "Ingresa tus datos para continuar."}
        </p>

        {/* CAMPO NOMBRE */}

        {modo === "registro" && (

          <>
            <label>Nombre completo</label>

            <input
              type="text"
              placeholder="Escribe tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </>

        )}

        {/* CAMPO CORREO */}

        <label>Correo electrónico</label>

        <input
          type="email"
          placeholder="ejemplo@correo.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        {/* CAMPO CONTRASEÑA */}

        <label>Contraseña</label>

        <input
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* CONFIRMAR CONTRASEÑA */}

        {modo === "registro" && (

          <>
            <label>Confirmar contraseña</label>

            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
            />
          </>

        )}

        {/* MENSAJES */}

        {error && (
          <p className="error">{error}</p>
        )}

        {mensaje && (
          <p className="mensaje">{mensaje}</p>
        )}

        {/* BOTÓN PRINCIPAL */}

        <button type="submit" disabled={cargando}>
          {cargando
            ? "Procesando..."
            : modo === "registro"
              ? "Registrarme"
              : "Iniciar sesión"}
        </button>

        {/* CAMBIAR FORMULARIO */}

        <div className="cambiar-modo">

          {modo === "registro"
            ? "¿Ya tienes una cuenta?"
            : "¿Todavía no tienes una cuenta?"}

          <button
            type="button"
            className="btn-enlace"
            onClick={cambiarModo}
          >
            {modo === "registro"
              ? "Inicia sesión"
              : "Regístrate"}
          </button>

        </div>

      </form>

    </div>

  );

}

export default Login;