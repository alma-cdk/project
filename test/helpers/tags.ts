export interface TagValue {
  Key: string;
  Value: string;
}

export function sortTagsByKey(tags: TagValue[]): TagValue[] {
  return tags.sort((a, b) => a.Key.localeCompare(b.Key));
}

export function tagsAsDictionary(tags: TagValue[]): { [key: string]: string } {
  return tags.reduce((acc: any, tag) => {
    acc[tag.Key] = tag.Value;
    return acc;
  }, {});
}
