interface BookmarkedMoment {
  id?: string;
  text?: string;
  timestamp?: string;
}

interface TopicsPatternsCardProps {
  locale: string;
  emotions: string[];
  distortionLabel: string;
  bookmarkedMoments: BookmarkedMoment[];
}

export default function TopicsPatternsCard({
  locale,
  emotions,
  distortionLabel,
  bookmarkedMoments,
}: TopicsPatternsCardProps) {
  return (
    <div className="rounded-[20px] border border-neutral-95 bg-white p-6">
      <div className="body-18 font-semibold text-label-normal">
        {locale === 'en' ? 'Topics & patterns' : '주요 주제 및 패턴'}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {emotions.map((emotion, index) => (
          <span
            key={`${emotion}-${index}`}
            className="rounded-[999px] border border-neutral-95 bg-neutral-99 px-3 py-[3px] body-14 text-label-normal"
          >
            {emotion}
          </span>
        ))}
        <span className="rounded-[999px] border border-[rgba(255,146,0,0.40)] bg-[rgba(255,146,0,0.10)] px-3 py-[3px] body-14 text-[#FF9200]">
          {distortionLabel}
        </span>
      </div>
      <div className="mt-4">
        <p className="body-14 font-medium text-label-normal">
          {locale === 'en' ? 'Bookmarked moments' : '북마크된 순간'}
        </p>
        <div className="mt-2 max-h-[160px] overflow-auto rounded-[12px] border border-neutral-95 p-3">
          {bookmarkedMoments.length === 0 ? (
            <p className="body-14 text-label-alternative">
              {locale === 'en' ? 'No bookmarks.' : '북마크가 없습니다.'}
            </p>
          ) : (
            <div className="space-y-2">
              {bookmarkedMoments.map((item, index) => (
                <div key={`${item.id ?? index}`} className="body-14 text-label-normal">
                  [{item.timestamp ?? '--:--:--'}] {item.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
