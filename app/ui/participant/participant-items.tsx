import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { deleteParticipant } from '@/lib/participant/actions';
import { EaterSize, Participant } from '@/lib/participant/types';
import { Beef, Drumstick, Ham, Pencil, Trash2, Wine } from 'lucide-react';
import Form from 'next/form';

export default function ParticipantItems({
  participants,
  handleEdit,
  adminToken,
}: {
  participants: Participant[];
  handleEdit: (participant: Participant) => void;
  adminToken: string;
}) {
  return (
    <ItemGroup className="gap-2">
      {participants.map((participant) => (
        <Item key={participant.id} variant="outline">
          <ItemContent>
            <ItemTitle>{participant.name}</ItemTitle>
            <ItemFooter>
              <ParticipantBadges participant={participant} />
            </ItemFooter>
          </ItemContent>
          <ItemActions>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleEdit(participant)}
              title="Modifier"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Form
              action={deleteParticipant.bind(null, adminToken, participant.id)}
            >
              <Button
                variant="outline"
                size="icon"
                title="Supprimer"
                type="submit"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Form>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}

function ParticipantBadges({ participant }: { participant: Participant }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary" className="gap-1.5 min-w-14">
        <EaterSizeIcons eaterSize={participant.eaterSize} />
      </Badge>

      <Badge
        variant={participant.noPork ? 'default' : 'secondary'}
        className="gap-1.5"
      >
        <SlashedIcon
          icon={<Ham className="h-3.5 w-3.5" />}
          slashed={participant.noPork}
        />
      </Badge>

      <Badge
        variant={participant.noAlcohol ? 'default' : 'secondary'}
        className="gap-1.5"
      >
        <SlashedIcon
          icon={<Wine className="h-3.5 w-3.5" />}
          slashed={participant.noAlcohol}
        />
      </Badge>

      <Badge
        variant={participant.isVeggie ? 'default' : 'secondary'}
        className="gap-1.5"
      >
        <SlashedIcon
          icon={<Beef className="h-3.5 w-3.5" />}
          slashed={participant.isVeggie}
        />
      </Badge>
    </div>
  );
}

function SlashedIcon({
  icon,
  slashed,
}: {
  icon: React.ReactNode;
  slashed: boolean;
}) {
  return (
    <span className="relative inline-flex h-4 w-4 items-center justify-center">
      {icon}
      {slashed ? (
        <span className="pointer-events-none absolute h-0.5 w-5 rotate-[-35deg] rounded bg-current" />
      ) : null}
    </span>
  );
}

function EaterSizeIcons({ eaterSize }: { eaterSize: EaterSize }) {
  const count = eaterSize === 'SMALL' ? 1 : eaterSize === 'MEDIUM' ? 2 : 3;

  return (
    <div className="flex items-center mr-1">
      {Array.from({ length: count }).map((_, index) => (
        <Drumstick key={index} className="h-4 w-4 -mr-1 relative" />
      ))}
    </div>
  );
}
