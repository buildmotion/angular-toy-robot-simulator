export interface PlaceEvent {
  type: 'PLACE';
  x: number;
  y: number;
  f: string; // Adjust the type based on what `f` represents (e.g., a direction)
}
