/**
 * Lista de usuarios autorizados para acceder al sistema
 * Solo los correos en esta lista pueden registrarse y usar la aplicación
 */

// IMPORTANTE: Agrega aquí los correos electrónicos de los ejecutivos autorizados
export const AUTHORIZED_USERS = [
    'teaminfinixdev@gmail.com',
    // Agrega más correos aquí:
    // 'ejecutivo1@ice.go.cr',
    // 'ejecutivo2@ice.go.cr',
];

/**
 * Verificar si un correo está autorizado
 */
export function isAuthorizedEmail(email) {
    return AUTHORIZED_USERS.includes(email.toLowerCase().trim());
}

/**
 * Verificar si el usuario actual es administrador
 * El primer correo de la lista es considerado administrador
 */
export function isAdmin(email) {
    return AUTHORIZED_USERS[0] === email.toLowerCase().trim();
}
