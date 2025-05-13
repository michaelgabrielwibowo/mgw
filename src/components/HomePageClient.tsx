// src/components/HomePageClient.tsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { LinkItem, LinkCategory, ExistingLink, Locale } from '@/types';
import { INITIAL_LINKS, CATEGORIES_INFO } from '@/data/staticLinks';
import { suggestLinks, SuggestLinksOutput } from '@/ai/flows/suggest-links';
import { AppLayout } from '@/components/AppLayout';
import { LinkList } from '@/components/LinkList';
import { FilterControls } from '@/components/FilterControls';
import { AISuggestionForm } from '@/components/AISuggestionForm';
import { ExportControls } from '@/components/ExportControls';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Lightbulb } from 'lucide-react'; 
import { useTranslations } from 'next-intl'; // No need for NextIntlClientProvider here if layout provides it

interface HomePageClientProps {
  locale: Locale;
  // messages prop removed as it should consume context from LocaleLayout
}

export default function HomePageClient({ locale }: HomePageClientProps) {
  const t = useTranslations(); // General translations for this component, relies on provider from layout

  const [allLinks, setAllLinks] = useState<LinkItem[]>([]); 
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('date-desc'); // Default to last added
  const [isAISuggesting, setIsAISuggesting] = useState<boolean>(false);
  const { toast } = useToast();

  const [linksFromLastUpload, setLinksFromLastUpload] = useState<ExistingLink[]>([]);
  const [latestAiSuggestions, setLatestAiSuggestions] = useState<LinkItem[]>([]);

  useEffect(() => {
    // Initialize with timestamped links
    setAllLinks(INITIAL_LINKS.map((link, index) => ({
      ...link, 
      addedTimestamp: Date.now() - (INITIAL_LINKS.length - index) * 1000 // Ensure distinct timestamps
    })));
  }, []);
  
  const handleAISuggest = async (
    keywords: string, 
    category: LinkCategory | '', 
    linkCount: number,
    existingLinksFromForm: ExistingLink[]
  ) => {
    setIsAISuggesting(true);
    setLinksFromLastUpload(existingLinksFromForm); 
    setLatestAiSuggestions([]);

    const allCurrentAppLinksForAI: ExistingLink[] = allLinks.map(link => ({ url: link.url, title: link.title }));
    const combinedExistingLinks = [...allCurrentAppLinksForAI, ...existingLinksFromForm];
    
    const uniqueExistingLinksMap = new Map<string, ExistingLink>();
    combinedExistingLinks.forEach(link => {
        if (!uniqueExistingLinksMap.has(link.url) || (link.title && !uniqueExistingLinksMap.get(link.url)?.title)) {
            uniqueExistingLinksMap.set(link.url, link);
        }
    });
    const uniqueExistingLinksForAI = Array.from(uniqueExistingLinksMap.values());

    try {
      const result: SuggestLinksOutput = await suggestLinks({ 
        keywords: keywords || undefined, 
        category: category || undefined,
        count: linkCount,
        existingLinks: uniqueExistingLinksForAI.length > 0 ? uniqueExistingLinksForAI : undefined,
      });

      if (result.suggestedLinks && result.suggestedLinks.length > 0) {
        const currentTimestamp = Date.now();
        const newLinks: LinkItem[] = result.suggestedLinks
          .filter(sl => !allLinks.some(al => al.url === sl.url)) // Ensure uniqueness against current allLinks
          .map((suggestedLink, index) => ({
            id: `ai-${currentTimestamp}-${index}`, 
            title: suggestedLink.title,
            description: suggestedLink.description,
            url: suggestedLink.url,
            category: 'AI Generated', 
            icon: CATEGORIES_INFO['AI Generated']?.icon || Lightbulb,
            source: 'ai',
            addedTimestamp: currentTimestamp + index, 
        }));

        if (newLinks.length > 0) {
            setLatestAiSuggestions(newLinks); 
            setAllLinks(prevLinks => [...prevLinks, ...newLinks]);
            toast({
              title: t('HomePage.aiSuggestionsAddedTitle'),
              description: t('HomePage.aiSuggestionsAddedDesc', { count: newLinks.length }),
              variant: "default",
            });
        } else {
             toast({
              title: t('HomePage.noNewUniqueSuggestionsTitle'),
              description: t('HomePage.noNewUniqueSuggestionsDesc'),
              variant: "default",
            });
        }
      } else {
        toast({
          title: t('HomePage.noNewSuggestionsTitle'),
          description: t('HomePage.noNewSuggestionsDesc'),
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      toast({
        title: t('HomePage.aiSuggestionFailedTitle'),
        description: t('HomePage.aiSuggestionFailedDesc'),
        variant: "destructive",
      });
    } finally {
      setIsAISuggesting(false);
    }
  };

  const filteredAndSortedLinks = useMemo(() => {
    let links = [...allLinks];

    if (selectedCategory !== 'All') {
      links = links.filter(link => link.category === selectedCategory);
    }

    switch (sortBy) {
      case 'title-asc':
        links.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        links.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'category-asc':
        links.sort((a, b) => {
          const catComp = a.category.localeCompare(b.category);
          if (catComp !== 0) return catComp;
          return a.title.localeCompare(b.title);
        });
        break;
      case 'date-asc': // First Added
        links.sort((a, b) => (a.addedTimestamp || 0) - (b.addedTimestamp || 0));
        break;
      case 'date-desc': // Last Added (Default)
        links.sort((a, b) => (b.addedTimestamp || 0) - (a.addedTimestamp || 0));
        break;
      default: // Default to last added
        links.sort((a, b) => (b.addedTimestamp || 0) - (a.addedTimestamp || 0));
        break;
    }
    return links;
  }, [allLinks, selectedCategory, sortBy]);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleSortChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
  }, []);


  return (
    // NextIntlClientProvider should be in LocaleLayout, wrapping this component's usage.
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{t('HomePage.aiSuggestionsTitle')}</CardTitle>
              <CardDescription>{t('HomePage.aiSuggestionsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <AISuggestionForm 
                onSuggest={handleAISuggest} 
                isLoading={isAISuggesting} 
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{t('HomePage.filterSortTitle')}</CardTitle>
              <CardDescription>{t('HomePage.filterSortDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <FilterControls
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
                currentSort={sortBy}
                onSortChange={handleSortChange}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{t('HomePage.exportDataTitle')}</CardTitle>
              <CardDescription>{t('HomePage.exportDataDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ExportControls 
                linksToExport={filteredAndSortedLinks} 
                uploadedLinks={linksFromLastUpload}
                latestAISuggestions={latestAiSuggestions}
              />
            </CardContent>
          </Card>
        </aside>

        <section className="lg:col-span-8 xl:col-span-9">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{t('HomePage.linkCollectionTitle')}</CardTitle>
              <CardDescription>
                {t('HomePage.linkCollectionDesc', { count: filteredAndSortedLinks.length, total: allLinks.length })}
                {selectedCategory !== 'All' && ` ${t('HomePage.filteredBy', { category: selectedCategory })}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LinkList links={filteredAndSortedLinks} />
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
