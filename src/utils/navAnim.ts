// Dirección del último cambio de tab, para que la pantalla entrante sepa
// si debe deslizarse desde la derecha (avance) o desde la izquierda (retroceso).
// Es un singleton de módulo: la BottomNav lo escribe justo antes de navegar y
// la pantalla lo lee en su efecto de foco (que se ejecuta después de navegar).
let lastDirection = 1; // 1 = adelante (derecha) · -1 = atrás (izquierda)

export function setNavDirection(direction: number) {
  lastDirection = direction >= 0 ? 1 : -1;
}

export function getNavDirection() {
  return lastDirection;
}
