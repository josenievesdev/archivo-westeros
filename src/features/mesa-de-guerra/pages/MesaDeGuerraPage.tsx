import { WarRoomView } from '../war-room/WarRoomView'
import { warRoomFixture } from '../war-room/war_room.fixture'

/**
 * `04 · Sala de estrategia`.
 *
 * De momento sirve el fixture de diseño: la vista ya es presentacional pura, así
 * que conectar la capa real consiste en sustituir este `warRoomFixture` por un
 * `WarRoomViewModel` construido a partir de las entidades canónicas.
 */
export function MesaDeGuerraPage() {
  return <WarRoomView warRoom={warRoomFixture} />
}
