import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const BUCKET = 'packages'

export async function uploadYaml(
  packageSlug: string,
  version: string,
  yamlContent: string
): Promise<string> {
  const path = `${packageSlug}/${version}.yaml`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, yamlContent, {
      contentType: 'text/yaml',
      upsert: true,
    })

  if (error) {
    throw new Error(`Failed to upload YAML: ${error.message}`)
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function getYaml(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch YAML from ${url}: ${response.statusText}`)
  }
  return response.text()
}

export async function deleteYaml(url: string): Promise<void> {
  // Extract path from the full public URL
  const urlObj = new URL(url)
  // Supabase public URL format: /storage/v1/object/public/{bucket}/{path}
  const pathParts = urlObj.pathname.split(`/object/public/${BUCKET}/`)
  if (pathParts.length < 2) {
    throw new Error(`Cannot extract storage path from URL: ${url}`)
  }

  const storagePath = pathParts[1]
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath])

  if (error) {
    throw new Error(`Failed to delete YAML: ${error.message}`)
  }
}
