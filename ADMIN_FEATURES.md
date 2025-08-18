# Admin Features for Form Submissions

This document outlines the admin features available for managing school plan form submissions in the District 79 application.

## Overview

Administrators (Level 4 users) have access to comprehensive tools for reviewing, approving, and managing form submissions from school principals.

## Features

### 1. View Submitted Forms
- **Location**: `/admin/submissions`
- **Access**: Level 4 (Admin) users only
- **Functionality**: 
  - View all form submissions in a table format
  - See school name, principal details, status, progress, and submission date
  - Sort and filter submissions by various criteria

### 2. Approve or Reject Submissions
- **Process**:
  1. Click "Review" button on any submission
  2. Select new status: Approved, Rejected, or Under Review
  3. Add comments and feedback for the principal
  4. Submit review
- **Status Options**:
  - `approved`: Form is accepted and complete
  - `rejected`: Form needs revisions
  - `under_review`: Form is being reviewed

### 3. Add Comments and Feedback
- **Review Modal**: Provides a text area for detailed feedback
- **Comments**: Stored with the submission and visible to principals
- **Audit Trail**: All reviews are tracked with reviewer name and timestamp

### 4. Track Submission Status
- **Real-time Updates**: Status changes are immediately reflected
- **Progress Tracking**: Visual progress bars show completion percentage
- **Status History**: Complete audit trail of status changes
- **Filtering**: View submissions by status (draft, submitted, under review, approved, rejected)

### 5. Generate Reports
- **CSV Export**: Download comprehensive submission reports
- **Date Range**: Filter by start and end dates
- **Status Filter**: Include/exclude specific statuses
- **Report Fields**:
  - School information
  - Principal details
  - Submission status and progress
  - Review information
  - Timestamps

## Dashboard Statistics

Admins can view submission statistics on the main dashboard:
- Total submissions count
- Breakdown by status
- Average completion progress
- Quick access to review submissions

## Notification System

### For Principals
- Receive notifications when submissions are reviewed
- View review comments and feedback
- See approval/rejection status
- Access reviewed submissions directly

### For Admins
- Track which submissions have been reviewed
- Monitor notification delivery
- Manage review workflow

## API Endpoints

### Forms Management
- `GET /api/forms` - Retrieve all forms (admin) or user's forms
- `PUT /api/forms/[id]` - Update form data and status
- `DELETE /api/forms/[id]` - Delete form (admin only)

### Admin Reports
- `POST /api/admin/reports` - Generate CSV reports

### Notifications
- `GET /api/notifications` - Retrieve user notifications
- `POST /api/notifications` - Mark notifications as read

## Data Model

The FormSubmission model includes:
- Basic submission information
- Form data for all 15 steps
- Review tracking fields
- Notification management
- Timestamps and audit trail

## Security

- **Authentication Required**: All admin endpoints require valid session
- **Role-based Access**: Only Level 4 users can access admin features
- **Data Isolation**: Users can only see their own submissions (unless admin)
- **Audit Logging**: All admin actions are tracked

## Usage Workflow

1. **Principal submits form** → Status: "submitted"
2. **Admin reviews submission** → Status: "under_review" or "approved"/"rejected"
3. **Principal receives notification** → Can view review results
4. **If rejected** → Principal can make changes and resubmit
5. **If approved** → Form is marked complete

## Best Practices

- Review submissions promptly to maintain workflow
- Provide clear, constructive feedback
- Use consistent status management
- Generate regular reports for oversight
- Monitor submission progress and completion rates

## Troubleshooting

### Common Issues
- **Permission Denied**: Ensure user has Level 4 access
- **Forms Not Loading**: Check database connection and authentication
- **Review Not Saving**: Verify form ID and review data format
- **Report Generation Fails**: Check date format and filter parameters

### Support
For technical issues or feature requests, contact the development team.
