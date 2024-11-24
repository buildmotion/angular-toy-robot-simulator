# Icons

To add a directional icon that updates when the user clicks the "Left" or "Right" buttons, you'll need to:

1. **Track the Robot's Direction**: Ensure your `RobotMachineService` or similar state management system maintains the robot's current direction.

2. **Determine Which Icon to Display**: You’ll map each direction (North, East, South, West) to a corresponding icon, using PrimeIcons or a similar icon set.

3. **Update the Icon Dynamically**: Reflect changes in direction onto the view each time the user clicks a turn button.

Here's how to implement this step-by-step:

1. **Extend `RobotMachineService`**: If not already available, ensure the robot's current direction is accessible.

   ```typescript
   export class RobotMachineService {
     // ... existing code ...

     get currentDirection(): 'NORTH' | 'EAST' | 'SOUTH' | 'WEST' {
       return this.service.state.context.facing;
     }

     // Turn methods
     turnLeft() {
       this.service = this.service.transition(this.service.state, 'TURN_LEFT');
     }

     turnRight() {
       this.service = this.service.transition(this.service.state, 'TURN_RIGHT');
     }
   }
   ```

2. **Map Directions to Icons**: Create a method in your component to return the appropriate icon class based on the direction.

   ```typescript
   @Component({
     selector: 'app-board',
     templateUrl: './board.component.html',
     styleUrls: ['./board.component.scss']
   })
   export class BoardComponent {
     constructor(private robotService: RobotMachineService) {}

     isRobotAtPosition(x: number, y: number): boolean {
       return this.robotService.isAtPosition(x, y);
     }

     getDirectionIcon(): string {
       switch (this.robotService.currentDirection) {
         case 'NORTH': return 'pi pi-arrow-up';
         case 'EAST': return 'pi pi-arrow-right';
         case 'SOUTH': return 'pi pi-arrow-down';
         case 'WEST': return 'pi pi-arrow-left';
         default: return '';
       }
     }
   }
   ```

3. **Update HTML Template**: Use the `getDirectionIcon()` method to apply the correct icon class.

   ```html
   <ng-container *ngFor="let cell of grid; let rowIndex = index">
     <tr *ngFor="let row of cell; let colIndex = index">
       <td (click)="placeRobot(colIndex, 4 - rowIndex)" 
           [ngClass]="{'robot-cell': isRobotAtPosition(colIndex, 4 - rowIndex)}"
           [attr.aria-label]="'Cell at ' + colIndex + ',' + (4 - rowIndex)">
         <span>{{colIndex}},{{4 - rowIndex}}</span>
         <i *ngIf="isRobotAtPosition(colIndex, 4 - rowIndex)" [ngClass]="getDirectionIcon()"></i>
       </td>
     </tr>
   </ng-container>
   ```

4. **Ensure Icons Update**: When you call `turnLeft()` or `turnRight()`, the change in direction should automatically reflect due to Angular's data binding.

5. **Test Your Implementation**: Verify that the robot’s directional icon updates correctly as you interact with the "Left" and "Right" buttons.

By following these steps, the robot's direction will be visually represented by the appropriate icon, updating dynamically as the robot turns.