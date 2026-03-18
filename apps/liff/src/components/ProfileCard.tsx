type Profile = {
  displayName: string;
  userId: string;
  statusMessage?: string;
  pictureUrl?: string;
};

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        {profile.pictureUrl ? (
          <img
            src={profile.pictureUrl}
            alt={profile.displayName}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-line-green/15 text-xl font-bold text-line-green">
            {profile.displayName.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-gray-900">
            {profile.displayName}
          </h2>
          {profile.statusMessage && (
            <p className="truncate text-sm text-gray-500">
              {profile.statusMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
