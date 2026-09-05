const fs = require('fs');

let content = fs.readFileSync('components/TripCard.tsx', 'utf8');

// 1. Remove the confirm() statement
content = content.replace(/if \(!confirm\("Are you sure you want to delete this trip\?"\)\) return;\s*/, '');

// 2. Add imports if they don't exist
if (!content.includes('AlertDialog')) {
  const alertImports = `
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
`;
  content = content.replace('import { Button } from "@/components/ui/button";', alertImports + '\nimport { Button } from "@/components/ui/button";');
}

// 3. Find the Button block
const buttonRegex = /<Button variant="destructive" size="icon" onClick=\{handleDelete\} disabled=\{isDeleting\} className="shadow-sm">[\s\S]*?<\/Button>/;

const newButton = `<AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" disabled={isDeleting} className="shadow-sm">
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this trip to {trip.destination}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete Trip</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>`;

content = content.replace(buttonRegex, newButton);

fs.writeFileSync('components/TripCard.tsx', content, 'utf8');
console.log("TripCard successfully updated.");