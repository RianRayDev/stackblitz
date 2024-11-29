// Add to ProfileCard props
interface ProfileCardProps {
  user: User;
  onUpdate?: (user: User) => void;
  showFollowButton?: boolean;
}

// Add FollowButton to the header actions
<div className="flex gap-2">
  {showFollowButton && (
    <FollowButton userId={user.id} />
  )}
  {onUpdate && (
    <Button
      onClick={() => setIsEditing(true)}
      className="bg-[#FFB080] hover:bg-[#FFB080]/90"
    >
      <Edit className="h-4 w-4 mr-2" />
      Edit Profile
    </Button>
  )}
</div>