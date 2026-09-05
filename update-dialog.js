const fs = require('fs');
let content = fs.readFileSync('components/TripCard.tsx', 'utf8');

// 1. Import AlertDialog components
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

// 2. Remove the confirm() from handleDelete
content = content.replace('if (!confirm("Are you sure you want to delete this trip?")) return;\n', '');

// 3. Replace the Delete Button with AlertDialog
const oldDeleteBtn = `<Button variant="destructive" size="icon" onClick={handleDelete} disabled={isDeleting} className="shadow-sm">
          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>`;

const newDeleteBtn = `<AlertDialog>
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

content = content.replace(oldDeleteBtn, newDeleteBtn);

fs.writeFileSync('components/TripCard.tsx', content, 'utf8');