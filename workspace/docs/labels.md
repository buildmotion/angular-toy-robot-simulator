# Labels

To display the coordinates of a grid square when hovered over, you'll want to use a combination of CSS for styling and Angular for dynamic content binding. Here's how you can achieve this:

1. **Update Your CSS**: Add styles to show coordinates on hover. Utilize the `:hover` pseudo-class to change visibility.

   ```scss
   .robot-cell {
     position: relative;
   }

   .hover-label {
     position: absolute;
     top: 0;
     left: 0;
     right: 0;
     bottom: 0;
     background-color: rgba(0, 0, 0, 0.7);
     color: white;
     display: none;
     align-items: center;
     justify-content: center;
     font-size: 12px;
   }

   .robot-cell:hover .hover-label {
     display: flex;
   }
   ```

2. **Modify Your HTML Template**: Integrate a span element that will display the coordinates.

   ```html
   <p-table [value]="grid" [style]="{ 'width': '100%', 'text-align': 'center' }" [responsive]="true" [paginator]="false">
     <ng-template pTemplate="body" let-row let-rowIndex="rowIndex">
       <tr>
         <td *ngFor="let cell of row; let colIndex = index;" (click)="placeRobot(colIndex, 4 - rowIndex)" 
             [ngClass]="{
               'robot-cell': isRobotHere(colIndex, 4 - rowIndex),
             }"
             [attr.aria-label]="'Cell at ' + colIndex + ',' + (4 - rowIndex)">
           <span>{{colIndex}},{{4 - rowIndex}}</span>
           <i *ngIf="isRobotHere(colIndex, 4 - rowIndex)" class="pi pi-android"></i>

           <!-- Hover Label -->
           <div class="hover-label">
             {{colIndex}},{{4 - rowIndex}}
           </div>
         </td>
       </tr>
     </ng-template>
   </p-table>
   ```

3. **Explanation of Changes**:
   - **CSS**:
     - `.hover-label`: Positioned absolutely within the cell to cover the content and display the hover information. It's initially hidden using `display: none`.
     - `.robot-cell:hover .hover-label`: Uses the `hover` pseudo-class to display the label when the cell is hovered over.

4. **Styling**: Adjust the styling of `.hover-label` to fit your aesthetic needs, such as changing background color, text color, or positioning as necessary.

This approach ensures the coordinates are only visible when the user hovers over a specific cell, making the interface clean and interactive.