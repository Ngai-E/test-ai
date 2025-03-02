#!/bin/bash

# Update dashboard component
sed -i '' 's/bi bi-arrow-clockwise/fas fa-sync-alt/g' src/app/admin/dashboard/dashboard.component.html
sed -i '' 's/bi bi-exclamation-triangle-fill/fas fa-exclamation-triangle/g' src/app/admin/dashboard/dashboard.component.html
sed -i '' 's/bi bi-calendar-check/fas fa-calendar-check/g' src/app/admin/dashboard/dashboard.component.html
sed -i '' 's/bi bi-people/fas fa-users/g' src/app/admin/dashboard/dashboard.component.html
sed -i '' 's/bi bi-box/fas fa-box/g' src/app/admin/dashboard/dashboard.component.html
sed -i '' 's/bi bi-cash/fas fa-money-bill-wave/g' src/app/admin/dashboard/dashboard.component.html

# Update review management component
sed -i '' 's/bi bi-arrow-clockwise/fas fa-sync-alt/g' src/app/admin/review-management/review-management.component.html
sed -i '' 's/bi bi-exclamation-triangle-fill/fas fa-exclamation-triangle/g' src/app/admin/review-management/review-management.component.html
sed -i '' 's/bi-star-fill text-warning/fas fa-star text-warning/g' src/app/admin/review-management/review-management.component.html
sed -i '' 's/bi-star/far fa-star/g' src/app/admin/review-management/review-management.component.html
sed -i '' 's/bi bi-eye/fas fa-eye/g' src/app/admin/review-management/review-management.component.html
sed -i '' 's/bi bi-check-lg/fas fa-check/g' src/app/admin/review-management/review-management.component.html
sed -i '' 's/bi bi-x-lg/fas fa-times/g' src/app/admin/review-management/review-management.component.html
sed -i '' 's/bi bi-trash/fas fa-trash/g' src/app/admin/review-management/review-management.component.html

# Update addon management component
sed -i '' 's/bi bi-arrow-left/fas fa-arrow-left/g' src/app/admin/addon-management/addon-management.component.html
sed -i '' 's/bi bi-plus-circle/fas fa-plus-circle/g' src/app/admin/addon-management/addon-management.component.html
sed -i '' 's/bi bi-exclamation-triangle-fill/fas fa-exclamation-triangle/g' src/app/admin/addon-management/addon-management.component.html
sed -i '' 's/bi bi-pencil/fas fa-pencil-alt/g' src/app/admin/addon-management/addon-management.component.html
sed -i '' 's/bi bi-trash/fas fa-trash/g' src/app/admin/addon-management/addon-management.component.html

# Update package management component
sed -i '' 's/bi bi-plus-circle/fas fa-plus-circle/g' src/app/admin/package-management/package-management.component.html
sed -i '' 's/bi bi-exclamation-triangle-fill/fas fa-exclamation-triangle/g' src/app/admin/package-management/package-management.component.html
sed -i '' 's/bi bi-pencil/fas fa-pencil-alt/g' src/app/admin/package-management/package-management.component.html
sed -i '' 's/bi bi-trash/fas fa-trash/g' src/app/admin/package-management/package-management.component.html
sed -i '' 's/bi bi-plus-circle/fas fa-plus-circle/g' src/app/admin/package-management/package-management.component.html
sed -i '' 's/bi bi-calendar-week/fas fa-calendar-week/g' src/app/admin/package-management/package-management.component.html

# Update user management component
sed -i '' 's/bi bi-arrow-clockwise/fas fa-sync-alt/g' src/app/admin/user-management/user-management.component.html
sed -i '' 's/bi bi-exclamation-triangle-fill/fas fa-exclamation-triangle/g' src/app/admin/user-management/user-management.component.html
sed -i '' 's/bi bi-search/fas fa-search/g' src/app/admin/user-management/user-management.component.html
sed -i '' 's/bi bi-person-x/fas fa-user-times/g' src/app/admin/user-management/user-management.component.html
sed -i '' 's/bi bi-eye/fas fa-eye/g' src/app/admin/user-management/user-management.component.html
sed -i '' 's/bi bi-person-check/fas fa-user-check/g' src/app/admin/user-management/user-management.component.html
sed -i '' 's/bi bi-person-dash/fas fa-user-slash/g' src/app/admin/user-management/user-management.component.html
sed -i '' 's/bi bi-person-x/fas fa-user-times/g' src/app/admin/user-management/user-management.component.html

# Update itinerary management component
sed -i '' 's/bi bi-arrow-left/fas fa-arrow-left/g' src/app/admin/itinerary-management/itinerary-management.component.html
sed -i '' 's/bi bi-plus-circle/fas fa-plus-circle/g' src/app/admin/itinerary-management/itinerary-management.component.html
sed -i '' 's/bi bi-exclamation-triangle-fill/fas fa-exclamation-triangle/g' src/app/admin/itinerary-management/itinerary-management.component.html
sed -i '' 's/bi bi-pencil/fas fa-pencil-alt/g' src/app/admin/itinerary-management/itinerary-management.component.html
sed -i '' 's/bi bi-trash/fas fa-trash/g' src/app/admin/itinerary-management/itinerary-management.component.html
sed -i '' 's/bi bi-house-door/fas fa-home/g' src/app/admin/itinerary-management/itinerary-management.component.html
sed -i '' 's/bi bi-cup-hot/fas fa-coffee/g' src/app/admin/itinerary-management/itinerary-management.component.html
sed -i '' 's/bi bi-calendar-check/fas fa-calendar-check/g' src/app/admin/itinerary-management/itinerary-management.component.html

echo "Icon updates completed!"
